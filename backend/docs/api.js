/**
 * @api {get} /experiments Get all experiments
 * @apiName GetExperiments
 * @apiGroup Experiments
 * @apiVersion 1.0.0
 *
 * @apiSuccess {Object[]} experiments List of experiments
 * @apiSuccess {String} experiments._id Experiment ID
 * @apiSuccess {String} experiments.title Experiment title
 * @apiSuccess {String} experiments.description Experiment description
 * @apiSuccess {String} experiments.status Current status (pending/in progress/completed)
 * @apiSuccess {Object[]} experiments.metrics List of experiment metrics
 * @apiSuccess {String} experiments.metrics.name Metric name
 * @apiSuccess {String} experiments.metrics.typeId Metric type ID
 * @apiSuccess {Date} experiments.createdAt Creation date
 * @apiSuccess {Date} experiments.updatedAt Last update date
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "experiments": [
 *         {
 *           "_id": "507f1f77bcf86cd799439011",
 *           "title": "Temperature Study",
 *           "description": "Study of temperature effects on growth",
 *           "status": "in progress",
 *           "metrics": [
 *             {
 *               "name": "temperature",
 *               "typeId": "507f1f77bcf86cd799439012"
 *             }
 *           ],
 *           "createdAt": "2024-03-15T10:00:00.000Z",
 *           "updatedAt": "2024-03-15T10:00:00.000Z"
 *         }
 *       ]
 *     }
 */

/**
 * @api {post} /experiments Create new experiment
 * @apiName CreateExperiment
 * @apiGroup Experiments
 * @apiVersion 1.0.0
 *
 * @apiBody {String} title Experiment title
 * @apiBody {String} [description] Experiment description
 * @apiBody {Object[]} metrics List of experiment metrics
 * @apiBody {String} metrics.name Metric name
 * @apiBody {String} metrics.typeId Metric type ID
 *
 * @apiSuccess {Object} experiment Created experiment
 * @apiSuccess {String} experiment._id Experiment ID
 * @apiSuccess {String} experiment.title Experiment title
 * @apiSuccess {String} experiment.description Experiment description
 * @apiSuccess {String} experiment.status Initial status (pending)
 * @apiSuccess {Object[]} experiment.metrics List of experiment metrics
 * @apiSuccess {Date} experiment.createdAt Creation date
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "experiment": {
 *         "_id": "507f1f77bcf86cd799439011",
 *         "title": "Temperature Study",
 *         "description": "Study of temperature effects on growth",
 *         "status": "pending",
 *         "metrics": [
 *           {
 *             "name": "temperature",
 *             "typeId": "507f1f77bcf86cd799439012"
 *           }
 *         ],
 *         "createdAt": "2024-03-15T10:00:00.000Z"
 *       }
 *     }
 *
 * @apiError (400) {Object} error Error object
 * @apiError (400) {String} error.message Error message
 */

/**
 * @api {get} /metric-types Get all metric types
 * @apiName GetMetricTypes
 * @apiGroup MetricTypes
 * @apiVersion 1.0.0
 *
 * @apiSuccess {Object[]} metricTypes List of metric types
 * @apiSuccess {String} metricTypes._id Metric type ID
 * @apiSuccess {String} metricTypes.name Metric type name
 * @apiSuccess {String} metricTypes.description Metric type description
 * @apiSuccess {Object} metricTypes.validation Validation rules
 * @apiSuccess {String} metricTypes.validation.type Validation type (number/text/boolean/date/select/custom)
 * @apiSuccess {Number} [metricTypes.validation.min] Minimum value for number type
 * @apiSuccess {Number} [metricTypes.validation.max] Maximum value for number type
 * @apiSuccess {String} metricTypes.format Display format (default/percentage/currency/scientific/custom)
 * @apiSuccess {String} [metricTypes.unit] Unit of measurement
 * @apiSuccess {Boolean} metricTypes.isActive Whether the metric type is active
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "metricTypes": [
 *         {
 *           "_id": "507f1f77bcf86cd799439011",
 *           "name": "temperature",
 *           "description": "Temperature measurement",
 *           "validation": {
 *             "type": "number",
 *             "min": -50,
 *             "max": 100
 *           },
 *           "format": "default",
 *           "unit": "°C",
 *           "isActive": true
 *         }
 *       ]
 *     }
 */

/**
 * @api {post} /metric-types Create new metric type
 * @apiName CreateMetricType
 * @apiGroup MetricTypes
 * @apiVersion 1.0.0
 *
 * @apiBody {String} name Metric type name
 * @apiBody {String} [description] Metric type description
 * @apiBody {Object} validation Validation rules
 * @apiBody {String} validation.type Validation type (number/text/boolean/date/select/custom)
 * @apiBody {Number} [validation.min] Minimum value for number type
 * @apiBody {Number} [validation.max] Maximum value for number type
 * @apiBody {String} [validation.pattern] Pattern for text type
 * @apiBody {String[]} [validation.options] Options for select type
 * @apiBody {String} [validation.customValidator] Custom validator function
 * @apiBody {String} [format] Display format (default/percentage/currency/scientific/custom)
 * @apiBody {String} [unit] Unit of measurement
 *
 * @apiSuccess {Object} metricType Created metric type
 * @apiSuccess {String} metricType._id Metric type ID
 * @apiSuccess {String} metricType.name Metric type name
 * @apiSuccess {String} metricType.description Metric type description
 * @apiSuccess {Object} metricType.validation Validation rules
 * @apiSuccess {String} metricType.format Display format
 * @apiSuccess {String} metricType.unit Unit of measurement
 * @apiSuccess {Boolean} metricType.isActive Whether the metric type is active
 *
 * @apiError (400) {Object} error Error object
 * @apiError (400) {String} error.message Error message
 */

/**
 * @api {post} /entries Create new entry
 * @apiName CreateEntry
 * @apiGroup Entries
 * @apiVersion 1.0.0
 *
 * @apiBody {String} experimentId Experiment ID
 * @apiBody {Object} values Metric values
 * @apiBody {String} [conclusion] Entry conclusion
 *
 * @apiSuccess {Object} entry Created entry
 * @apiSuccess {String} entry._id Entry ID
 * @apiSuccess {String} entry.experimentId Experiment ID
 * @apiSuccess {Object} entry.values Metric values
 * @apiSuccess {String} [entry.conclusion] Entry conclusion
 * @apiSuccess {Date} entry.date Entry timestamp
 *
 * @apiError (400) {Object} error Error object
 * @apiError (400) {String} error.message Error message
 * @apiError (404) {Object} error Error object
 * @apiError (404) {String} error.message Error message
 */

/**
 * @api {get} /entries/experiment/:experimentId Get entries by experiment ID
 * @apiName GetEntriesByExperiment
 * @apiGroup Entries
 * @apiVersion 1.0.0
 *
 * @apiParam {String} experimentId Experiment ID
 *
 * @apiSuccess {Object[]} entries List of entries
 * @apiSuccess {String} entries._id Entry ID
 * @apiSuccess {String} entries.experimentId Experiment ID
 * @apiSuccess {Object} entries.values Metric values
 * @apiSuccess {String} [entries.conclusion] Entry conclusion
 * @apiSuccess {Date} entries.date Entry timestamp
 *
 * @apiError (404) {Object} error Error object
 * @apiError (404) {String} error.message Error message
 */
