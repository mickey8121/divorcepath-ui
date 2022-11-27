/* eslint-disable no-alert */
import React, { useCallback, useState } from 'react';

import Button from 'components/common/Button';
import DeleteUserModal from 'components/modals/profile/DeleteUserModal';
import Input from 'components/common/inputs/Text';
import Icon from 'components/common/Icon';

import useModal from 'hooks/useModal';

const DeleteUser = () => {
  const { open } = useModal('DELETE_USER');

  const [type, setType] = useState('password');

  const [password, setPassword] = useState('');

  const [isOpenEye, setOpenEye] = useState(false);

  const toggle = useCallback(() => open(), [open]);

  return (
    <div className='update-form delete-user-form'>
      <div className='inputs-container'>
        <div className='left-side'>
          <h4 className='title'>Delete account</h4>
          <p className='subtitle'>
            Deleting your account is irreversible and can affect past activities.
          </p>
        </div>

        <div className='right-side'>
          <div className='form-group custom-input input-md'>
            <label htmlFor='oldPassword' className='form-control-label mb-2'>
              Password
            </label>
            <div className='input-group'>
              <Input
                size='md'
                name='confirmPassword'
                className='input-sm form-control'
                label='Confirm password'
                placeholder='Confirm password'
                type={type}
                handleChange={e => setPassword(e.target.value)}
                value={password}
              />
              <div className='prepend-icon'>
                <Icon name='EyeIcon' />
              </div>

              <div
                className='append-icon'
                onClick={() => {
                  setType(isOpenEye ? 'password' : 'text');
                  setOpenEye(!isOpenEye);
                }}
              >
                <Icon name={isOpenEye ? 'eye-on' : 'eye-off'} />
              </div>
            </div>
            <p className='tip'>To delete your account you need to verify your password.</p>
          </div>

          <div className='btn-group-form' role='group'>
            <Button size='md' color='danger' onClick={toggle}>
              Delete account
            </Button>
          </div>

          <DeleteUserModal password={password} />
        </div>
      </div>
    </div>
  );
};

export default DeleteUser;
