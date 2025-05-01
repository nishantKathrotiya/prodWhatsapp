const History = require('../Modal/History');

const getMessageHistory = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const history = await History.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        const total = await History.countDocuments();

        res.json({
            success: true,
            data: history,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching message history:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching message history',
            error: error.message
        });
    }
};

const getMessageHistoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const history = await History.findById(id).lean();

        if (!history) {
            return res.status(404).json({
                success: false,
                message: 'Message history not found'
            });
        }

        res.json({
            success: true,
            data: history
        });
    } catch (error) {
        console.error('Error fetching message history by ID:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching message history',
            error: error.message
        });
    }
};

module.exports = {
    getMessageHistory,
    getMessageHistoryById
}; 