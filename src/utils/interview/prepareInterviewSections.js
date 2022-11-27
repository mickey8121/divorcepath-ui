import dayjs from 'dayjs';
import { capitalize } from 'lodash';

import checkConflict from 'utils/interview/checkConflict';
import formatDate from 'utils/interview/formatDate';
import prepareProfileSections from 'utils/interview/prepareProfileSections';
import toUSD from 'utils/toUSD';

const prepareInterviewSections = (client, conflicts, interview) => {
  const { profile, exProfile, address, exAddress, relationship, children } = client;
  const {
    profile: conflictProfile,
    exProfile: conflictExProfile,
    address: conflictAddress,
    exAddress: conflictExAddress,
    relationship: conflictRelationship,
    children: conflictChildren,
  } = conflicts;

  const childrenArr = children?.length > conflictChildren?.length ? children : conflictChildren;

  const childrenForCheck = childrenArr?.map((child, index) => {
    if (children?.[index]) return children?.[index];

    return child;
  });

  return [
    prepareProfileSections(profile, conflictProfile, address, conflictAddress, 'Client', interview),
    prepareProfileSections(
      exProfile,
      conflictExProfile,
      exAddress,
      conflictExAddress,
      'Ex',
      interview,
    ),
    [
      {
        name: 'Relationship:',
        isEmpty:
          !relationship?.cohabitationDate &&
          !relationship?.marriageDate &&
          !relationship?.separationDate &&
          !relationship?.marriagePlace &&
          !relationship?.divorceDate &&
          !conflictRelationship?.cohabitationDate &&
          !conflictRelationship?.marriageDate &&
          !conflictRelationship?.separationDate &&
          !conflictRelationship?.marriagePlace &&
          !conflictRelationship?.divorceDate,
        fields: [
          {
            name: 'Date of Cohabitation:',
            value: formatDate(relationship?.cohabitationDate),
            conflictValue: formatDate(conflictRelationship?.cohabitationDate),
            hasConflict: checkConflict(conflictRelationship?.cohabitationDate),
            paths: ['relationship.cohabitationDate'],
          },
          {
            name: 'Date of Separation:',
            value: formatDate(relationship?.separationDate),
            conflictValue: formatDate(conflictRelationship?.separationDate),
            hasConflict: checkConflict(conflictRelationship?.separationDate),
            paths: ['relationship.separationDate'],
          },
          {
            name: 'Legally Married?',
            value: relationship?.isMarried ? 'Married' : 'Common Law',
            conflictValue: conflictRelationship?.isMarried ? 'Married' : 'Common Law',
            hasConflict: checkConflict(conflictRelationship?.isMarried),
            paths: ['relationship.isMarried'],
          },
          {
            name: 'Separated?',
            value: relationship?.isSeparated ? 'Separated' : 'Cohabiting',
            conflictValue: conflictRelationship?.isSeparated ? 'Separated' : 'Cohabiting',
            hasConflict: checkConflict(conflictRelationship?.isSeparated),
            paths: ['relationship.isSeparated'],
          },
          {
            name: 'Date of Marriage:',
            value: formatDate(relationship?.marriageDate),
            conflictValue: formatDate(conflictRelationship?.marriageDate),
            hasConflict: checkConflict(conflictRelationship?.marriageDate),
            paths: ['relationship.marriageDate'],
          },
          {
            name: 'Place of Marriage:',
            value: relationship?.marriagePlace,
            conflictValue: conflictRelationship?.marriagePlace,
            hasConflict: checkConflict(conflictRelationship?.marriagePlace),
            paths: ['relationship.marriagePlace'],
          },
          {
            name: 'Divorced?',
            value: relationship?.isDivorced ? 'Yes' : 'No',
            conflictValue: conflictRelationship?.isDivorced ? 'Yes' : 'No',
            hasConflict: checkConflict(conflictRelationship?.isDivorced),
            paths: ['relationship.isDivorced'],
          },
          {
            name: 'Date of Divorce:',
            value: formatDate(relationship?.divorceDate),
            conflictValue: formatDate(conflictRelationship?.divorceDate),
            hasConflict: checkConflict(conflictRelationship?.divorceDate),
            paths: ['relationship.divorceDate'],
          },
        ],
      },
    ],
    [
      {
        name: 'Children:',
        isEmpty: !children?.length && !conflictChildren?.length,
        fields: childrenForCheck?.map((_, index) => {
          const child = children?.[index];
          const conflictedChild = conflictChildren?.[index];
          const interviewChild = interview?.children?.[index];

          const name = child?.firstName || '';
          const nameFromConflicts = interviewChild?.firstName || '';

          const gender = child?.gender ? ` (${child?.gender?.toLowerCase()})` : undefined;
          const genderFromConflicts = interviewChild?.gender
            ? ` (${interviewChild?.gender?.toLowerCase()})`
            : undefined;

          const age = dayjs().diff(child?.birthDate, 'years');
          const ageFromConflicts = dayjs().diff(conflictedChild?.birthDate, 'years');

          const childNamePaths = ['firstName', 'gender'].reduce((acc, path) => {
            const hasConflict = checkConflict(conflictedChild?.[path]);

            if (hasConflict) acc.push(`children.${index}.${path}`);

            return acc;
          }, []);

          return {
            name,
            subFields: [
              {
                name: 'Name:',
                value: `${name || ''}${gender || ''}`,
                conflictValue: `${nameFromConflicts || ''}${genderFromConflicts || ''}`,
                hasConflict:
                  checkConflict(conflictedChild?.firstName) ||
                  checkConflict(conflictedChild?.gender),
                paths: childNamePaths,
              },
              {
                name: 'Born on:',
                value: child?.birthDate && `${formatDate(child?.birthDate)} (age ${age})`,
                conflictValue:
                  conflictedChild?.birthDate &&
                  `${formatDate(conflictedChild?.birthDate)} (age ${ageFromConflicts})`,
                hasConflict: checkConflict(conflictedChild?.birthDate),
                paths: [`children.${index}.birthDate`],
              },
              {
                name: 'Primary Parent:',
                value: capitalize(child?.parenting || ''),
                conflictValue: capitalize(conflictedChild?.parenting || ''),
                hasConflict: checkConflict(conflictedChild?.parenting),
                paths: [`children.${index}.parenting`],
              },
              {
                name: 'Date Child Starts School:',
                value: child?.startSchoolDate ? `${formatDate(child?.startSchoolDate)}` : 'No',
              },
              {
                name: 'Date Child Finishes School:',
                value: child?.endSchoolDate ? `${formatDate(child?.startSchoolDate)}` : 'No',
              },
              {
                name: 'Child of Relationship?',
                value: child?.isOfRelationship ? 'Yes' : 'No',
                conflictValue: conflictedChild?.isOfRelationship ? 'Yes' : 'No',
                hasConflict: checkConflict(conflictedChild?.isOfRelationship),
                paths: [`children.${index}.isOfRelationship`],
              },
              {
                name: 'Is this child a legal dependent?',
                value:
                  child?.isOfRelationship && age >= 18
                    ? child?.isDependent
                      ? 'Yes'
                      : 'No'
                    : undefined,
                conflictValue:
                  interviewChild?.isOfRelationship && age >= 18
                    ? conflictedChild?.isDependent
                      ? 'Yes'
                      : 'No'
                    : undefined,
                hasConflict: checkConflict(conflictedChild?.isDependent),
                paths: [`children.${index}.isDependent`],
              },
              {
                name: 'Is this child a legal dependent?',
                value:
                  !child?.isOfRelationship && age >= 18
                    ? child?.isDependent
                      ? 'Yes'
                      : 'No'
                    : undefined,
                conflictValue:
                  !interviewChild?.isOfRelationship && age >= 18
                    ? conflictedChild?.isDependent
                      ? 'Yes'
                      : 'No'
                    : undefined,
                hasConflict: checkConflict(conflictedChild?.isDependent),
                paths: [`children.${index}.isDependent`],
              },
              {
                name: 'Child of Prior Relationship?',
                value: child?.isOfRelationship
                  ? undefined
                  : child?.priorRelationship
                  ? 'Yes'
                  : 'No',
                conflictValue: interviewChild?.isOfRelationship
                  ? undefined
                  : conflictedChild?.priorRelationship
                  ? 'Yes'
                  : 'No',
                hasConflict: checkConflict(conflictedChild?.priorRelationship),
                paths: [`children.${index}.priorRelationship`],
              },
              {
                name: 'Child is Supported By:',
                value:
                  !child?.isOfRelationship &&
                  child?.priorRelationship &&
                  capitalize(child?.supportedBy || ''),
                conflictValue:
                  !interviewChild?.isOfRelationship &&
                  interviewChild?.priorRelationship &&
                  capitalize(conflictedChild?.supportedBy || ''),
                hasConflict: checkConflict(conflictedChild?.supportedBy),
                paths: [`children.${index}.supportedBy`],
              },
              {
                name: 'Support Type:',
                value:
                  !child?.isOfRelationship &&
                  child?.priorRelationship &&
                  capitalize(child?.supportType || ''),
                conflictValue:
                  !interviewChild?.isOfRelationship &&
                  interviewChild?.priorRelationship &&
                  capitalize(conflictedChild?.supportType || ''),
                hasConflict: checkConflict(conflictedChild?.supportType),
                paths: [`children.${index}.supportType`],
              },
              {
                name: 'Child Has Disability?',
                value: child?.disabled ? 'Yes' : 'No',
                conflictValue: conflictedChild?.disabled ? 'Yes' : 'No',
                hasConflict: checkConflict(conflictedChild?.disabled),
                paths: [`children.${index}.disabled`],
              },
              {
                name: "Child's Income:",
                value: `${toUSD(child?.childIncome || 0)}`,
              },
            ],
          };
        }),
      },
    ],
  ];
};

export default prepareInterviewSections;
