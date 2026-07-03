const { Stage } = require('aws-cdk-lib');
const { NotificationQueuesStack } = require('./notification-queues-stack');

class ProductionStage extends Stage {
  constructor(scope, id, props) {
    super(scope, id, props);

    new NotificationQueuesStack(this, 'NotificationQueuesStack', props);
  }
}

module.exports = { ProductionStage };
