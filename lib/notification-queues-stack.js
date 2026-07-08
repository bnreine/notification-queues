const { Stack, aws_ssm } = require('aws-cdk-lib');
const sqs = require('aws-cdk-lib/aws-sqs');

const QUEUES = [
  {
    id: 'NotificationGeneratorQueue',
    queueName: 'notification-generator-queue',
    exportPrefix: 'NotificationGeneratorQueue',
  },
  {
    id: 'NotificationDeliveryQueue',
    queueName: 'notification-delivery-queue',
    exportPrefix: 'NotificationDeliveryQueue',
  },
];

class NotificationQueuesStack extends Stack {
  /**
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    for (const { id: queueId, queueName, exportPrefix } of QUEUES) {
      const dlq = new sqs.Queue(this, `${queueId}Dlq`, {
        queueName: `${queueName}-dlq`,
      });

      const queue = new sqs.Queue(this, queueId, {
        queueName,
        deadLetterQueue: {
          queue: dlq,
          maxReceiveCount: 5,
        },
      });

      new aws_ssm.StringParameter(this, `${exportPrefix}Arn`, {
        parameterName: `/notifications/${exportPrefix}/arn`,
        stringValue: queue.queueArn,
      });
    }
  }
}

module.exports = { NotificationQueuesStack };
