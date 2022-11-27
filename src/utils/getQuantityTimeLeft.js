import dayjs from 'dayjs';

const getQuantityTimeLeft = (subscription, includeCurrentPeriod) => {
  if (
    !subscription ||
    (!subscription.cancelAtPeriodEnd && !includeCurrentPeriod && !subscription.currentPeriodEnd)
  ) {
    return null;
  }

  const days = dayjs(subscription?.currentPeriodEnd).diff(dayjs(), 'days');
  const hours = dayjs(subscription?.currentPeriodEnd).diff(dayjs(), 'hours');

  if (days === 1) return '1 day left';
  if (days > 1) return `${days} days left`;
  if (hours === 1) return '1 hour left';
  if (hours > 1) return `${hours} hours left`;

  return 'less than an hour left';
};

export default getQuantityTimeLeft;
