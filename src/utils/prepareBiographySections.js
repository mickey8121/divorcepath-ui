import dayjs from 'dayjs';
import { capitalize } from 'lodash';

import toUSD from 'utils/toUSD';

const getName = ({ lastName, firstName }) => {
  if (lastName && firstName) return `${firstName} ${lastName}`;
  return firstName || lastName || '';
};

const prepareProfileInfo = (id, profile, address, profileName, isClient) => {
  const clientName = profile?.firstName
    ? `${profile?.firstName || ''} ${profile?.middleName || ''} ${profile?.lastName || ''}`
    : profile?.email;

  const gender = profile?.gender ? ` (${profile?.gender === 'MALE' ? 'Male' : 'Female'})` : '';

  const link = `/clients/${id}/edit/`;

  const name = ['Client', 'Ex'].includes(profileName) ? `${profileName}'s` : profileName;

  const background = profileName === 'Ex' ? 'exBackground' : 'background';
  const addressPath = profileName === 'Ex' ? 'exAddress' : 'address';

  return [
    {
      name: `${name} Bio:`,
      link: isClient ? `/profile/${background}` : `${link}${background}`,
      isEmpty: !clientName && !gender,
      fields: [
        {
          name: 'Name:',
          value: `${clientName}${gender}`,
        },
        {
          name: 'Born on:',
          value:
            profile?.birthDate &&
            `${dayjs(profile?.birthDate).format('DD-MM-YYYY')} (age ${dayjs().diff(
              profile?.birthDate,
              'years',
            )})`,
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
        !address?.postal,
      link: isClient ? `/profile/${addressPath}` : `${link}${addressPath}`,
      fields: [
        {
          name: 'Country:',
          value: address?.country,
        },
        {
          name: 'Province/Territory:',
          value: address?.province,
        },
        {
          name: 'City:',
          value: address?.city,
        },
        {
          name: 'Street:',
          value: address?.street1,
        },
        {
          name: 'Postal Code:',
          value: address?.postal,
        },
      ],
    },
    {
      name: `${name} Contacts:`,
      isEmpty: !profile?.email && !profile?.phone,
      link: isClient ? `/profile/${background}` : `${link}${background}`,
      fields: [
        {
          name: 'Email:',
          value: profile?.email,
        },
        {
          name: 'Phone Number:',
          value: profile?.phone,
        },
      ],
    },
  ];
};

const prepareBiographySections = (client, isClient) => {
  const { id, profile, exProfile, address, exAddress, relationship, children } = client;

  return [
    prepareProfileInfo(id, profile, address, isClient ? 'Your' : 'Client', isClient),
    prepareProfileInfo(id, exProfile, exAddress, 'Ex', isClient),
    [
      {
        name: 'Relationship:',
        isEmpty:
          !relationship?.cohabitationDate &&
          !relationship?.marriageDate &&
          !relationship?.separationDate &&
          !relationship?.marriagePlace &&
          !relationship?.divorceDate,
        link: isClient ? '/profile/relationship' : `/clients/${id}/edit/relationship`,
        fields: [
          {
            name: 'Date of Cohabitation:',
            value:
              relationship?.cohabitationDate &&
              dayjs(relationship?.cohabitationDate).format('DD-MM-YYYY'),
          },
          {
            name: 'Date of Separation:',
            value:
              relationship?.separationDate &&
              dayjs(relationship?.separationDate).format('DD-MM-YYYY'),
          },
          {
            name: 'Legally Married?',
            value: relationship?.isMarried ? 'Married' : 'Common Law',
          },
          {
            name: 'Separated?',
            value: relationship?.isSeparated ? 'Separated' : 'Cohabiting',
          },
          {
            name: 'Date of Marriage:',
            value:
              relationship?.marriageDate && dayjs(relationship?.marriageDate).format('DD-MM-YYYY'),
          },
          {
            name: 'Place of Marriage:',
            value: relationship?.marriagePlace,
          },
          {
            name: 'Divorced?',
            value:
              typeof relationship?.isDivorced === 'boolean'
                ? relationship?.isDivorced
                  ? 'Yes'
                  : 'No'
                : undefined,
          },
          {
            name: 'Date of Divorce:',
            value:
              relationship?.divorceDate && dayjs(relationship?.divorceDate).format('DD-MM-YYYY'),
          },
        ],
      },
    ],
    [
      {
        name: 'Children:',
        isEmpty: !children.length,
        link: isClient ? '/profile/children' : `/clients/${id}/edit/children`,
        fields: children?.map((child, index) => {
          const childName = getName(child || {});
          const gender = child?.gender
            ? ` (${child?.gender?.toLowerCase()})`
            : " (gender isn't selected)";

          const age = dayjs().diff(child?.birthDate, 'years');

          return {
            name: `Child ${index}`,
            subFields: [
              {
                name: 'Name:',
                value: `${childName}${gender}`,
              },
              {
                name: 'Born on:',
                value:
                  child?.birthDate &&
                  `${dayjs(child?.birthDate).format('DD-MM-YYYY')} (age ${age})`,
              },
              {
                name: 'Primary Parent:',
                value: child?.isOfRelationship && capitalize(child?.parenting || ''),
              },
              {
                name: 'Date Child Starts School:',
                value: child?.startSchoolDate
                  ? `${dayjs(child?.startSchoolDate).format('DD-MM-YYYY')}`
                  : undefined,
              },
              {
                name: 'Date Child Finishes School:',
                value: child?.endSchoolDate
                  ? `${dayjs(child?.endSchoolDate).format('DD-MM-YYYY')}`
                  : undefined,
              },
              {
                name: 'Is this child a legal dependent?',
                value:
                  child?.isOfRelationship && age >= 18
                    ? child?.isDependent
                      ? 'Yes'
                      : 'No'
                    : undefined,
              },
              {
                name: 'Adult child still a legal dependant?',
                value:
                  !child?.isOfRelationship && age >= 18
                    ? child?.isDependent
                      ? 'Yes'
                      : 'No'
                    : undefined,
              },
              {
                name: 'Child of Prior Relationship?',
                value: child?.isOfRelationship
                  ? undefined
                  : child?.priorRelationship
                  ? 'Yes'
                  : 'No',
              },
              {
                name: 'Child is Supported By:',
                value:
                  !child?.isOfRelationship &&
                  child?.priorRelationship &&
                  capitalize(child?.supportedBy || ''),
              },
              {
                name: 'Support Type:',
                value:
                  !child?.isOfRelationship &&
                  child?.priorRelationship &&
                  capitalize(child?.supportType || ''),
              },
              {
                name: 'Child Has Disability?',
                value: child?.disabled ? 'Yes' : undefined,
              },
              {
                name: "Child's Income:",
                value: child?.childIncome && `${toUSD(child?.childIncome || 0)}`,
              },
            ],
          };
        }),
      },
    ],
  ];
};

export default prepareBiographySections;
