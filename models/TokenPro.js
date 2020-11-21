const mongoose = require('mongoose');
const tokenSchema = new mongoose.Schema({
    _proId: 
    {
         type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Pro' 
    },
    token: 
    { 
        type: String, required: true 
    },
    createdAt: 
    {
         type: Date, required: true, default: Date.now, expires: 43200 
    }
});

module.exports = mongoose.model('TokenPro',tokenSchema);