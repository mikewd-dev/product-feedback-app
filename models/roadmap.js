const mongoose = require ('mongoose');
const Schema = mongoose.Schema

const RoadmapSchema = new Schema({
    id: Number,
    title: String,
    category:String,
    upvotes: Number,
    status:String,
    description:String,
    comments:[
            {
                type: Schema.Types.ObjectId,
                ref:"Comment"
            }
        ]
})

module.exports = mongoose.model('Roadmap', RoadmapSchema);
