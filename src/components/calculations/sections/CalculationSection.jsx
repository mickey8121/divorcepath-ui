import React, { useState, useCallback, useMemo } from 'react';

import { Collapse, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useFormikContext } from 'formik';

import TextInput from 'components/common/inputs/TextInput';
import CalculationsTypeDropdown from 'components/common/CalculationsTypeDropdown';
import LocationPrompt from 'components/common/LocationPrompt';
import Button from 'components/common/Button';
import Icon from 'components/common/Icon';

import CardHeader from 'components/calculations/components/CardHeader';
import PreviousCalculations from 'components/calculations/PreviousCalculations/PreviousCalculations';
import DuplicateCalculationButton from 'components/calculations/components/DuplicateCalculationButton';
import OptionsForm from 'components/calculations/components/OptionsForm';
import ClientSelectContainer from 'components/calculations/components/ClientSelect/ClientSelectContainer';
import SaveCalculationButton from 'components/calculations/components/SaveCalculationButton';

import useCalculationContext from 'hooks/useCalculationContext';
import useCurrentUser from 'hooks/useCurrentUser';

const cardHeaderIcon = './img/icons/dusk/png/client-base.png';

const CalculationSection = ({ clientName, handleSubmit, initialValues }) => {
  const { type, client, calculatorType } = useCalculationContext();
  const { values } = useFormikContext();

  const { isPro } = useCurrentUser();
  const [isOpen, toggleOpen] = useState(false);

  const toggle = useCallback(() => toggleOpen(prev => !prev), []);

  const buttonsClassName = useMemo(() => {
    if (type === 'create') return 'two-btn';

    return 'three-btn';
  }, [type]);

  return (
    <div>
      <LocationPrompt initialValues={initialValues} values={values} />
      <div className='calculator-section-container' name='#calculation'>
        <CardHeader src={cardHeaderIcon} text='1. Calculation' />
        <div className='calculator-section'>
          {!isPro && (
            <div className='ml-3 mr-2'>
              {calculatorType === 'CHILD' ? (
                <React.Fragment>
                  <p>
                    Use this calculator to calculate child support according to the Canadian Child
                    Support Guidelines. Simply enter your information in the form below and click
                    the "calculate" button to view the support calculation.
                  </p>
                  <p>
                    To calculate spousal support & child support together, use the
                    <Link to='/spousal-support'>&nbsp;child & spousal support calculator</Link>.
                  </p>
                  <p>
                    For more information on how to correctly calculate child support and the
                    relevant legal issues, visit the
                    <a
                      target='new'
                      href='https://www.divorcepath.com/help-center-categories/child-support'
                    >
                      &nbsp;child support help center
                    </a>
                    .
                  </p>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <p>
                    Use this free calculator to calculate spousal support according to the Canadian
                    Spousal Support Advisory Guidelines, as well as child support (if applicable).
                    Simply enter your information in the form below and click the "calculate" button
                    to view your support calculation.
                  </p>
                  <p>
                    To calculate child support without spousal support, use the
                    <Link to='/child-support'>&nbsp;child support calculator</Link>.
                  </p>
                  <p>
                    For more information on how to correctly calculate spousal support and the
                    relevant legal issues, visit the
                    <a
                      target='help'
                      href='https://www.divorcepath.com/help-center-categories/spousal-support'
                    >
                      &nbsp;spousal support help center
                    </a>
                    .
                  </p>
                </React.Fragment>
              )}
            </div>
          )}

          {isPro && (
            <React.Fragment>
              <h6>Select Client</h6>
              <p>Select an existing client or save this calculation to a new client profile.</p>
              <ClientSelectContainer />
            </React.Fragment>
          )}
          <React.Fragment>
            <Row noGutters className='border-top py-4 cursor-pointer' onClick={toggle}>
              <Col sm={10} lg={5} className='col-10'>
                <div className='d-flex align-items-center'>
                  <span className='avatar'>
                    <img
                      alt='placeholder'
                      src='./img/icons/dusk/png/icons8-save-64.png'
                      className='img-saturate'
                      height='50'
                      width='50'
                    />
                  </span>
                  <div className='avatar-content' id='savedCalculationsRow'>
                    <h5 className='mb-0 d-none d-lg-block'>Saved Calculations</h5>
                    <h6 className='mb-0 d-block d-lg-none'>Saved Calculations</h6>
                    <small className='d-block text-muted'>
                      Save & edit {`${clientName}'s `}
                      calculations
                    </small>
                  </div>
                </div>
              </Col>
              <Col sm={2} lg={7} className='col-2 d-flex justify-content-end'>
                <div className='btn-icon-only text-center ml-lg-0'>
                  <Icon name={`arrow-${isOpen ? 'up' : 'down'}`} />
                </div>
              </Col>
            </Row>

            <Collapse isOpen={isOpen} className='w-100 calculations-list p-0'>
              <div>
                <h6>Calculation Title</h6>

                <p>
                  Name your calculation something descriptive (i.e. &quot;High Income Support&quot;
                  or &quot;Shared Parenting Support&quot;).
                </p>

                <div className={`calculation-title-row ${buttonsClassName}`}>
                  <div className='input-title-container'>
                    <TextInput name='title' placeholder='Title' touchable />
                    <SaveCalculationButton
                      handleSubmit={handleSubmit}
                      initialValues={initialValues}
                    />
                  </div>
                  <div className='buttons'>
                    <SaveCalculationButton
                      handleSubmit={handleSubmit}
                      initialValues={initialValues}
                    />
                    {type === 'update' && <DuplicateCalculationButton />}
                    <CalculationsTypeDropdown
                      clientId={client?.id}
                      client={client}
                      size='lg'
                      icon='document-add'
                      clientChildren={client?.children}
                      btnToggleText='New'
                    />
                  </div>
                </div>
              </div>
              <PreviousCalculations clientName={clientName} client={client} />
              <div className='d-flex justify-content-end my-2'>
                <Button onClick={toggle} size='sm' color='link' leftIcon='cross'>
                  Close
                </Button>
              </div>
            </Collapse>
          </React.Fragment>
          <OptionsForm />
        </div>
      </div>
    </div>
  );
};

export default CalculationSection;
