/* eslint-disable react/no-array-index-key */
import React, { useMemo } from 'react';

import { Link } from 'react-router-dom';

import prepareBiographySections from 'utils/prepareBiographySections';

const Biography = ({ client, isClient }) => {
  const bioSections = useMemo(() => prepareBiographySections(client, isClient), [client, isClient]);

  return (
    <div className='biography-container'>
      {bioSections.map((section, i) => {
        if (section[0]?.isEmpty) return null;

        return (
          <div className='biography-section-container' key={i}>
            {section.map(({ name, fields, isEmpty, link }) => {
              if (isEmpty) return null;

              return (
                <Link
                  to={{
                    pathname: link,
                    state: { fromClientList: true },
                  }}
                  className='biography-section'
                  key={name}
                >
                  <div className='section-name'>{name}</div>
                  <div className='section-fields-list'>
                    {fields.map(({ name: fieldName, value, subFields }) => {
                      if (!value && !subFields) return null;

                      if (Array.isArray(subFields)) {
                        return (
                          <div className='field sub-field' key={fieldName}>
                            {subFields.map(({ name: subFieldName, value: subFieldValue }) => {
                              if (!subFieldValue) return null;

                              return (
                                <div key={subFieldName} className='sub-field'>
                                  {subFieldName && (
                                    <span className='field-name'>{subFieldName}</span>
                                  )}
                                  <span className='field-value'>{subFieldValue}</span>
                                </div>
                              );
                            })}
                          </div>
                        );
                      }

                      return (
                        <div key={fieldName + i} className='field'>
                          {fieldName && <span className='field-name'>{fieldName}</span>}
                          <span className='field-value'>{value}</span>
                        </div>
                      );
                    })}
                  </div>
                </Link>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Biography;
