import Metrics from '../models/Metrics.js'

export const getMetrics = async (req, res) => {
  try {
    let metrics = await Metrics.findOne()
    if (!metrics) {
      metrics = await Metrics.create({})
    }
    res.json(metrics)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateMetrics = async (req, res) => {
  try {
    let metrics = await Metrics.findOne()
    if (!metrics) {
      metrics = await Metrics.create({})
    }
    Object.assign(metrics, req.body)
    await metrics.save()
    res.json(metrics)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}