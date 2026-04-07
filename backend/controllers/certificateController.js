const PDFDocument = require('pdfkit');

/**
 * Download a certificate for students with 1000+ ecoPoints
 * GET /api/certificates/download
 */
exports.downloadCertificate = async (req, res) => {
  try {
    const user = req.user;
    const points = user.ecoPoints || 0;

    if (user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can download certificates'
      });
    }

    if (points < 1000) {
      return res.status(403).json({
        success: false,
        message: 'Certificate available only after reaching 1000 ecoPoints'
      });
    }

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const fileName = 'Eco-Excellence-Certificate.pdf';

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    doc.fontSize(26).fillColor('#0f766e').text('Certificate of Eco Excellence', {
      align: 'center',
      underline: true,
      lineGap: 12
    });

    doc.moveDown(2);
    doc.fontSize(16).fillColor('#111827').text(`Presented to:`, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(24).fillColor('#065f46').text(user.name, { align: 'center', bold: true });

    doc.moveDown(2);
    doc.fontSize(14).fillColor('#374151').text(
      `In recognition of outstanding commitment to environmental stewardship and dedication to eco-friendly actions.`,
      {
        align: 'center',
        lineGap: 8,
        indent: 40,
        width: 460
      }
    );

    doc.moveDown(2);
    doc.fontSize(18).fillColor('#0f766e').text(`Total Eco Points: ${points}`, { align: 'center' });
    doc.moveDown(1);
    doc.fontSize(14).fillColor('#4b5563').text(`Date: ${new Date().toLocaleDateString()}`, {
      align: 'center'
    });

    doc.moveDown(3);
    doc.fontSize(12).fillColor('#6b7280').text('Keep growing your impact with every eco-action. 🌍', {
      align: 'center'
    });

    doc.end();
    doc.pipe(res);
  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate certificate',
      error: error.message
    });
  }
};
