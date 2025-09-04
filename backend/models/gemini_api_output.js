const mongoose = require('mongoose');

const geminiApiOutputSchema = new mongoose.Schema({
	fileId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'Material', // or Assignment, depending on your use case
	},
	fileUrl: {
		type: String,
		required: true,
	},
	endpoint: {
		type: String,
		enum: ['brief-overview', 'assesment', 'podcast'],
		required: true,
	},
	output: {
		type: Object,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

geminiApiOutputSchema.index({ fileId: 1, endpoint: 1 }, { unique: true });

module.exports = mongoose.model('GeminiApiOutput', geminiApiOutputSchema);
