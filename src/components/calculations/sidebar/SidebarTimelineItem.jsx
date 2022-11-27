import React, { useCallback, useState } from 'react';

import classNames from 'classnames';

import ScrollLink from 'components/common/ScrollLink';

const SidebarTimelineItem = ({ id, index, color, title, children, current, noLink }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <div className='custom-timeline'>
      <div
        className={classNames('timeline-item my-0 pb-4', { link: !noLink })}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <ScrollLink onClick={handleMouseLeave} to={id}>
          <span
            className={classNames(
              `custom-timeline-step bg-${color} border-${color} text-white custom-timeline-step-hover-${color}`,
              {
                [`custom-timeline-step-shadow-${color}`]: current === id || isHovered,
              },
            )}
          >
            {index}
          </span>
          {!noLink && (
            <div className={classNames('timeline-item-content', { underline: isHovered })}>
              <h6
                className={classNames('text-sm mb-1', {
                  underline: current === id,
                })}
              >
                {title}
              </h6>

              {children}
            </div>
          )}
        </ScrollLink>
        {noLink && (
          <div className='timeline-item-content'>
            <h6 className={classNames('text-sm mb-1', { underline: isHovered || current === id })}>
              <ScrollLink to={id}>{title}</ScrollLink>
            </h6>
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
export default SidebarTimelineItem;
