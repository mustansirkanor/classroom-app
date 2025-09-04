const fs = require('fs');
const axios = require('axios');
const path = require('path');
const Material = require('../models/Material');
const GeminiApiOutput = require('../models/gemini_api_output');

// Helper to download file from cloudinary
async function downloadFile(fileUrl, tempFilePath) {
  const response = await axios({
    url: fileUrl,
    method: 'GET',
    responseType: 'stream',
  });
  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(tempFilePath);
    response.data.pipe(stream);
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

// Helper to send file to SIH API
async function sendToSihApi(endpoint, tempFilePath) {
  const FormData = require('form-data');
  const formData = new FormData();
  formData.append('file', fs.createReadStream(tempFilePath));
  const url = `https://sih-theta-gules.vercel.app/${endpoint}`;
  const response = await axios.post(url, formData, {
    headers: formData.getHeaders(),
  });
  return response.data;
}

// Generic handler for SIH endpoints
async function handleSihRequest(req, res, endpoint) {
  try {
    let { fileId, fileUrl } = req.body;
    if (!fileId) {
      return res.status(400).json({ error: 'fileId is required' });
    }
    // If fileUrl not provided, fetch from Material model
    if (!fileUrl) {
      const material = await Material.findById(fileId);
      if (!material || !material.fileUrl) {
        return res.status(404).json({ error: 'File not found or fileUrl missing in Material.' });
      }
      fileUrl = material.fileUrl;
    }
    // Check if already processed
    const existing = await GeminiApiOutput.findOne({ fileId, endpoint });
    if (existing) {
      return res.status(400).json({ error: `Output for ${endpoint} already exists for this file.` });
    }
    // Download file
    const tempFilePath = path.join(__dirname, `../../tmp/${fileId}_${endpoint}.pdf`);
    await downloadFile(fileUrl, tempFilePath);
    // Send to SIH API
    const output = await sendToSihApi(endpoint, tempFilePath);
    // Store output
    const result = await GeminiApiOutput.create({ fileId, fileUrl, endpoint, output });
    // Remove temp file
    fs.unlinkSync(tempFilePath);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  downloadFile,
  sendToSihApi,
  handleSihRequest,
};
