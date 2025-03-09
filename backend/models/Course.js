const mongoose= require('mongoose')

const courseschema= mongoose.schema({
    title: { 
        type: String, 
        required: true,
         trim: true },
    teacher: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: "User", 
         required: true },
    videos: [{
        url: { 
        type: String, 
        required: true },
    
        quality: { 
        type: String,
         enum: ["144p", "360p", "720p", "1080p"], 
         default: "720p" },

        format: { 
        type: String,
         enum: ["mp4", "avi", "mkv", "webm"], 
         default: "mp4" }}],

    students: [{ type: mongoose.Schema.Types.ObjectId,
         ref: "User"}]

})

module.exports = mongoose.model("Course", courseSchema);