const dayjs = require('dayjs');

const formatDate = date => date && dayjs(date).format('DD-MM-YYYY');

export default formatDate;
