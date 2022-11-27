import React, { forwardRef, useMemo } from 'react';

import classnames from 'classnames';
import { Button as BSButton } from 'reactstrap';

import Icon from 'components/common/Icon';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Button = forwardRef(
  (
    {
      children,
      className,
      color, // primary | white | secondary | stroke | link | white-link | red-link | (default: primary)
      loading,
      disabled,
      spin,
      borderDashed,
      size, // sm | md | lg (default: md)
      iconClassName,
      leftIcon, // custom icon from design
      leftFAIcon, // icon from Font Awesome package
      rightIcon, // custom icon from design
      rightFAIcon, // icon from Font Awesome package
      ...props
    },
    ref,
  ) => {
    const hasLeftIcon = useMemo(() => leftIcon || leftFAIcon, [leftIcon, leftFAIcon]);
    const hasRightIcon = useMemo(() => rightIcon || rightFAIcon, [rightIcon, rightFAIcon]);

    const btnClassName = useMemo(
      () =>
        classnames(
          'custom-button text-limit',
          {
            'left-icon': hasLeftIcon,
            'right-icon': hasRightIcon,
            'only-icon': !children && (hasLeftIcon || hasRightIcon),
          },
          className,
        ),
      [className, hasLeftIcon, hasRightIcon, children],
    );

    return (
      <BSButton
        type='button'
        ref={ref}
        color={color || 'primary'}
        size={size || 'md'}
        className={classnames(btnClassName, { 'btn-dashed-link': borderDashed })}
        disabled={loading || disabled}
        {...props}
      >
        {leftIcon && <Icon name={leftIcon} className={iconClassName} spin={spin} />}
        {leftFAIcon && <FontAwesomeIcon className={iconClassName} icon={leftFAIcon} />}
        {children && <span>{children}</span>}
        {rightIcon && <Icon name={rightIcon} className={iconClassName} spin={spin} />}
        {rightFAIcon && <FontAwesomeIcon className={iconClassName} icon={rightFAIcon} />}
      </BSButton>
    );
  },
);

export default Button;
