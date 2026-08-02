const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const PageContentBlock = require('../models/PageContentBlock');

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'altjawal-cms',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Only image files are allowed.'));
    cb(null, true);
  },
});

// GET /api/admin/cms/:pageSlug
router.get('/:pageSlug', async (req, res) => {
  try {
    const blocks = await PageContentBlock.find({ pageSlug: req.params.pageSlug });
    res.json({ blocks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/admin/cms/save-block
router.post('/save-block', async (req, res) => {
  try {
    const {
      pageSlug, blockKey, label, blockType,
      content, image, htmlTag,
      fontFamily, fontSize, fontWeight, fontStyle, textDecoration,
      textColor, lineHeight, letterSpacing, textAlign,
      marginTop, marginRight, marginBottom, marginLeft,
      paddingTop, paddingRight, paddingBottom, paddingLeft,
      width, height, minHeight, maxWidth, maxHeight,
    } = req.body;

    if (!pageSlug || !blockKey) {
      return res.status(400).json({ message: 'pageSlug and blockKey required.' });
    }

    const update = {
      ...(label          != null && { label }),
      ...(blockType      != null && { blockType }),
      ...(content        != null && { content }),
      ...(image          != null && { image }),
      ...(htmlTag        != null && { htmlTag }),
      ...(fontFamily     != null && { fontFamily }),
      ...(fontSize       != null && { fontSize }),
      ...(fontWeight     != null && { fontWeight }),
      ...(fontStyle      != null && { fontStyle }),
      ...(textDecoration != null && { textDecoration }),
      ...(textColor      != null && { textColor }),
      ...(lineHeight     != null && { lineHeight }),
      ...(letterSpacing  != null && { letterSpacing }),
      ...(textAlign      != null && { textAlign }),
      ...(marginTop      != null && { marginTop }),
      ...(marginRight    != null && { marginRight }),
      ...(marginBottom   != null && { marginBottom }),
      ...(marginLeft     != null && { marginLeft }),
      ...(paddingTop     != null && { paddingTop }),
      ...(paddingRight   != null && { paddingRight }),
      ...(paddingBottom  != null && { paddingBottom }),
      ...(paddingLeft    != null && { paddingLeft }),
      ...(width          != null && { width }),
      ...(height         != null && { height }),
      ...(minHeight      != null && { minHeight }),
      ...(maxWidth       != null && { maxWidth }),
      ...(maxHeight      != null && { maxHeight }),
    };

    const block = await PageContentBlock.findOneAndUpdate(
      { pageSlug, blockKey },
      { $set: update },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ block });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/admin/cms/upload-image
router.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });
  res.json({ url: req.file.path });
});

module.exports = router;
