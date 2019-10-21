const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leaderBoardSchema = new Schema({
	userScores: [ { type: Schema.Types.ObjectId, ref: 'User' } ]
});

const LeaderBoard = mongoose.model('LeaderBoard', leaderBoardSchema);
module.exports = LeaderBoard;
