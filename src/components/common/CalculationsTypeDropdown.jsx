import React, { useCallback, useState, useMemo, Fragment } from 'react';

import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { DropdownToggle, DropdownMenu, DropdownItem, Dropdown } from 'reactstrap';

import useCurrentUser from 'hooks/useCurrentUser';

import Button from './Button';

const CalculationsTypeDropdown = ({
  icon,
  headerMenuLabel,
  header,
  client,
  clientId,
  blank,
  size = 'md',
  color = 'primary',
  right = true,
  btnToggleText = 'New Calculation',
  clientChildren = [],
  className,
  active,
  otherLinks = [],
  isOpen: customIsOpen,
  toggle: customToggle,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { me, isPro } = useCurrentUser();

  const toggle = useCallback(() => {
    if (customToggle) return customToggle();

    return setIsOpen(prev => !prev);
  }, [customToggle]);
  const currentIsOpen = useMemo(
    () => (customIsOpen === undefined ? isOpen : customIsOpen),
    [customIsOpen, isOpen],
  );

  const disabled = useMemo(() => {
    if (!isPro) return false;

    if (!clientChildren.length) return false;

    return clientChildren.every(c => c?.isOfRelationship !== false);
  }, [clientChildren, isPro]);

  const isHideChildrenCalculation = useMemo(
    () => !client?.children?.length && client?.profileProgress?.children === 'COMPLETE',
    [client],
  );

  const links = useMemo(
    () => [
      {
        pathname: '/child-support',
        hasChildren: true,
        label: 'Child Support',
        hide: isHideChildrenCalculation,
      },
      {
        pathname: '/spousal-support',
        hasChildren: false,
        label: 'Spousal Support',
        disabled,
      },
      {
        pathname: '/spousal-support',
        hasChildren: true,
        label: 'Child & Spousal Support',
        hide: isHideChildrenCalculation,
      },
    ],
    [disabled, isHideChildrenCalculation],
  );

  const filteredLinks = useMemo(() => links.filter(l => !l.hide), [links]);
  const filteredOtherLinks = useMemo(() => otherLinks.filter(l => !l?.hide), [otherLinks]);

  const formattedLinks = useMemo(() => {
    if (!clientId && !header) return filteredLinks;

    return filteredLinks.map(({ label, pathname, ...values }) => ({
      ...values,
      pathname: clientId && !me?.client?.id ? `${pathname}/${clientId}/create` : pathname,
      label: header ? `${label} Calculator` : label,
    }));
  }, [filteredLinks, clientId, header, me]);

  const dropdownClassName = useMemo(
    () => classNames('calculations-type-dropdown', `size-${size}`, className),
    [className, size],
  );

  return (
    <Dropdown
      toggle={toggle}
      size={size}
      color={color}
      isOpen={currentIsOpen}
      className={dropdownClassName}
    >
      <DropdownToggle
        tag={Button}
        size={size}
        className={classNames('dropdown-btn', { [`btn-${color}`]: color, active })}
        leftIcon={!!icon && icon}
        rightIcon='arrow-down'
      >
        {btnToggleText}
      </DropdownToggle>
      <DropdownMenu {...{ right }}>
        {headerMenuLabel && (
          <DropdownItem header className='item-header'>
            {headerMenuLabel}
          </DropdownItem>
        )}
        {formattedLinks.map(({ hasChildren, label, disabled: isDisabled, pathname }) => (
          <DropdownItem
            key={label}
            tag={Link}
            target={blank ? '_blank' : undefined}
            to={{
              pathname,
              state: { hasChildren },
            }}
            disabled={isDisabled}
          >
            {label}
          </DropdownItem>
        ))}
        {!!otherLinks.length && (
          <Fragment>
            <DropdownItem header className='item-header'>
              More
            </DropdownItem>
            {filteredOtherLinks.map(({ label, pathname, type, onClick }) => {
              if (type === 'button') {
                return (
                  <DropdownItem key={label} onClick={onClick}>
                    {label}
                  </DropdownItem>
                );
              }

              return (
                <DropdownItem
                  key={label}
                  tag={Link}
                  target={blank ? '_blank' : undefined}
                  to={{
                    pathname,
                  }}
                >
                  {label}
                </DropdownItem>
              );
            })}
          </Fragment>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

export default CalculationsTypeDropdown;
