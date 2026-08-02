const getProfile = (req, res) => {
    res.status(200).json({
        message: "Protected route",
        user: req.user,
    });
};

export {getProfile};
