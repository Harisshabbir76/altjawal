const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  pageSlug:       { type: String, required: true },
  blockKey:       { type: String, required: true },
  label:          { type: String, required: true },
  blockType:      { type: String, enum: ['text', 'textarea', 'image'], default: 'text' },
  content:        { type: String, default: '' },
  image:          { type: String, default: '' },
  htmlTag:        { type: String, default: null },
  fontFamily:     { type: String, default: null },
  fontSize:       { type: String, default: null },
  fontWeight:     { type: String, default: null },
  fontStyle:      { type: String, default: null },
  textDecoration: { type: String, default: null },
  textColor:      { type: String, default: null },
  lineHeight:     { type: String, default: null },
  letterSpacing:  { type: String, default: null },
  textAlign:      { type: String, default: null },
  marginTop:      { type: String, default: null },
  marginRight:    { type: String, default: null },
  marginBottom:   { type: String, default: null },
  marginLeft:     { type: String, default: null },
  paddingTop:     { type: String, default: null },
  paddingRight:   { type: String, default: null },
  paddingBottom:  { type: String, default: null },
  paddingLeft:    { type: String, default: null },
  width:          { type: String, default: null },
  height:         { type: String, default: null },
  minHeight:      { type: String, default: null },
  maxWidth:       { type: String, default: null },
  maxHeight:      { type: String, default: null },
});

schema.index({ pageSlug: 1, blockKey: 1 }, { unique: true });

module.exports = mongoose.model('PageContentBlock', schema);
