import dayjs from 'dayjs';

export const changeDateFormat = (dateString) => {
  if (!dateString) return '--/--/---- --:--:--';
  return dayjs(dateString).format('DD/MM/YYYY HH:mm:ss');
};
