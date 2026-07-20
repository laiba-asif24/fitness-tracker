const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');

const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Report = require('../models/Report');
const Workout = require('../models/Workout');
const NutritionLog = require('../models/NutritionLog');
const ProgressLog = require('../models/ProgressLog');

const REPORTS_DIR = path.join(__dirname, '..', 'uploads', 'reports');
if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });

// Fetches the raw data for the requested reportType & date range
const fetchReportData = async (userId, reportType, from, to) => {
  const dateQuery = {};
  if (from) dateQuery.$gte = new Date(from);
  if (to) dateQuery.$lte = new Date(to);
  const query = { user: userId };
  if (from || to) query.date = dateQuery;

  switch (reportType) {
    case 'progress':
      return ProgressLog.find(query).sort({ date: 1 }).lean();
    case 'nutrition':
      return NutritionLog.find(query).sort({ date: 1 }).lean();
    case 'workout_summary':
      return Workout.find(query).sort({ date: 1 }).lean();
    default:
      throw new ApiError(400, 'Invalid reportType');
  }
};
const generateReport = asyncHandler(async (req, res) => {
  const { reportType, format, from, to } = req.body;

  if (!reportType || !format) throw new ApiError(400, 'reportType and format are required');
  if (!['pdf', 'csv'].includes(format)) throw new ApiError(400, 'format must be pdf or csv');

  const data = await fetchReportData(req.user._id, reportType, from, to);

  const fileName = `${reportType}_${req.user._id}_${Date.now()}.${format}`;
  const filePath = path.join(REPORTS_DIR, fileName);

  if (format === 'csv') {
    const parser = new Parser({ flatten: true });
    const csv = parser.parse(data);
    fs.writeFileSync(filePath, csv);
  } else {
    // format === 'pdf'
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(18).text(`${reportType.toUpperCase()} REPORT`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(10);

    data.forEach((entry, idx) => {
      doc.text(`${idx + 1}. ${JSON.stringify(entry)}`);
      doc.moveDown(0.5);
    });

    doc.end();
    await new Promise((resolve) => stream.on('finish', resolve));
  }

  const fileUrl = `/uploads/reports/${fileName}`;

  const report = await Report.create({
    user: req.user._id,
    reportType,
    format,
    dateRange: { from: from || null, to: to || null },
    fileUrl,
  });

  res.status(201).json({ success: true, data: report });
});

// @desc    Get all report records for logged-in user
// @route   GET /api/reports
// @access  Private
const getReports = asyncHandler(async (req, res) => {
  const reports = await Report.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: reports.length, data: reports });
});
const deleteReport = asyncHandler(async (req, res) => {
  const report = await Report.findOne({ _id: req.params.id, user: req.user._id });
  if (!report) throw new ApiError(404, 'Report not found');

  const filePath = path.join(__dirname, '..', report.fileUrl);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  await report.deleteOne();
  res.status(200).json({ success: true, message: 'Report deleted successfully' });
});

module.exports = { generateReport, getReports, deleteReport };