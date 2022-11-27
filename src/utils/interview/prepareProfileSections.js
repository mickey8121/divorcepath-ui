import dayjs from 'dayjs';
import { isNil } from 'lodash';

import checkConflict from 'utils/interview/checkConflict';
import formatDate from 'utils/interview/formatDate';

const prepareProfileSections = (
  profile,
  conflictProfile,
  address,
  conflictAddress,
  profileName,
  interview,
) => {
  const name = ['Client', 'Ex'].includes(profileName) ? `${profileName}'s` : profileName;
  const pathName = profileName === 'Ex' ? 'exProfile' : 'profile';

  const clientName = profile?.firstName
    ? `${profile?.firstName || ''} ${profile?.lastName || ''}`
    : undefined;
  const clientNameFromConflicts = interview?.[pathName]?.firstName
    ? `${interview?.[pathName]?.firstName || ''} ${interview?.[pathName]?.lastName || ''}`
    : undefined;

  const gender = profile?.gender ? ` (${profile?.gender === 'MALE' ? 'Male' : 'Female'})` : '';
  const genderFromConflicts = interview?.[pathName]?.gender
    ? ` (${interview?.[pathName]?.gender === 'MALE' ? 'Male' : 'Female'})`
    : undefined;

  const age = dayjs().diff(profile?.birthDate, 'years');
  const ageFromConflicts = dayjs().diff(conflictProfile?.birthDate, 'years');

  const story = profileName === 'Client' && interview?.story;

  const profilePaths = ['firstName', 'lastName', 'gender'].reduce((acc, path) => {
    const hasConflict = checkConflict(conflictProfile?.[path]);

    if (hasConflict) acc.push(`${pathName}.${path}`);

    return acc;
  }, []);

  return [
    {
      name: `${name} Bio:`,
      isEmpty: !clientName && !gender && !clientNameFromConflicts && !genderFromConflicts,
      fields: [
        {
          name: 'Name:',
          value: clientName && `${clientName || ''}${gender || ''}`,
          conflictValue: `${clientNameFromConflicts || ''}${genderFromConflicts || ''}`,
          hasConflict:
            checkConflict(conflictProfile?.firstName) ||
            checkConflict(conflictProfile?.lastName) ||
            checkConflict(conflictProfile?.gender),
          paths: profilePaths,
        },
        {
          name: 'Born on:',
          value: profile?.birthDate && `${formatDate(profile?.birthDate)} (age ${age})`,
          conflictValue:
            conflictProfile?.birthDate &&
            `${formatDate(conflictProfile?.birthDate)} (age ${ageFromConflicts})`,
          hasConflict: checkConflict(conflictProfile?.birthDate),
          paths: [`${pathName}.birthDate`],
        },
      ],
    },
    {
      name: `${name} Address:`,
      isEmpty:
        !address?.country &&
        !address?.province &&
        !address?.city &&
        !address?.street1 &&
        !address?.postal &&
        !conflictAddress?.country &&
        !conflictAddress?.province &&
        !conflictAddress?.city &&
        !conflictAddress?.street1 &&
        !conflictAddress?.postal,
      fields: [
        {
          name: 'Country:',
          value: address?.country,
          conflictValue: conflictAddress?.country,
          hasConflict: checkConflict(conflictAddress?.country),
          paths: [`${profileName === 'Ex' ? 'exAddress' : 'address'}.country`],
        },
        {
          name: 'Province/Territory:',
          value: address?.residence,
          conflictValue: conflictAddress?.residence,
          hasConflict: checkConflict(conflictAddress?.residence),
          paths: [`${profileName === 'Ex' ? 'exAddress' : 'address'}.residence`],
        },
        {
          name: 'City:',
          value: address?.city,
          conflictValue: conflictAddress?.city,
          hasConflict: checkConflict(conflictAddress?.city),
          paths: [`${profileName === 'Ex' ? 'exAddress' : 'address'}.city`],
        },
        {
          name: 'Street:',
          value: address?.street1,
          conflictValue: conflictAddress?.street1,
          hasConflict: checkConflict(conflictAddress?.street1),
          paths: [`${profileName === 'Ex' ? 'exAddress' : 'address'}.street1`],
        },
        {
          name: 'Postal Code:',
          value: address?.postal,
          conflictValue: conflictAddress?.postal,
          hasConflict: checkConflict(conflictAddress?.postal),
          paths: [`${profileName === 'Ex' ? 'exAddress' : 'address'}.postal`],
        },
      ],
    },
    {
      name: `${name} Contacts:`,
      isEmpty:
        !profile?.email && !profile?.phone && !conflictProfile?.email && !conflictProfile?.phone,
      fields: [
        {
          name: 'Email:',
          value: profile?.email,
          conflictValue:
            !interview?.exLawyer || profileName === 'Client' ? conflictProfile?.email : undefined,
          hasConflict:
            (!interview?.exLawyer || profileName === 'Client') &&
            checkConflict(conflictProfile?.email),
          paths: [`${pathName}.email`],
        },
        {
          name: 'Phone Number:',
          value: profile?.phone,
          conflictValue:
            !interview?.exLawyer || profileName === 'Client' ? conflictProfile?.phone : undefined,
          hasConflict:
            (!interview?.exLawyer || profileName === 'Client') &&
            checkConflict(conflictProfile?.phone),
          paths: [`${pathName}.phone`],
        },
      ],
    },
    {
      name: `${name} Options:`,
      isEmpty: isNil(profile?.hasNewPartner) && isNil(conflictProfile?.hasNewPartner),
      fields: [
        {
          name: 'New Partner:',
          value: profile?.hasNewPartner ? 'Yes' : 'No',
          conflictValue: conflictProfile?.hasNewPartner ? 'Yes' : 'No',
          hasConflict: checkConflict(conflictProfile?.hasNewPartner),
          paths: [`${pathName}.hasNewPartner`],
        },
      ],
    },
    {
      name: `${name} Story:`,
      isEmpty: typeof story !== 'string',
      fields: [
        {
          value: story,
        },
      ],
    },
    {
      name: `Lawyer for the Ex:`,
      isEmpty: !interview?.exLawyer || profileName === 'Client',
      fields: [
        {
          name: 'Does the ex have a lawyer?:',
          value: interview?.exLawyer ? 'Yes' : 'No',
        },
        {
          name: "Lawyer's Company Name:",
          value: interview?.exLawyerCompanyName,
        },
        {
          name: "Lawyer's Name:",
          value: interview?.exLawyerName,
        },
      ],
    },
  ];
};

export default prepareProfileSections;
