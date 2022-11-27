import dayjs from 'dayjs';

const getAge = birthDate => dayjs().diff(birthDate, 'years');

export default getAge;
