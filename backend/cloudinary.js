const cloudinary = require('cloudinary');

cloudinary.config({ 
    cloud_name: 'decfbxi3e', 
    api_key: '737587248939161', 
    api_secret: 'pX7u4Qzl4NJnFLNpiz6jFUkrT0g'
  });

module.exports = cloudinary;