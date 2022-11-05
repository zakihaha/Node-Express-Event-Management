const notFound = (req, res) => {
    res.status(404).send({ msg: "Route doesn't exist" })
}

module.exports = notFound