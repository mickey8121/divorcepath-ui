import React from 'react';

import classNames from 'classnames';

import { ReactComponent as AddPersonIcon } from 'img/icons/add-person.svg';
import { ReactComponent as AlertIcon } from 'img/icons/alert.svg';
import { ReactComponent as ArrowCircleUpIcon } from 'img/icons/arrow-circle-up.svg';
import { ReactComponent as ArrowDownIcon } from 'img/icons/arrow-down.svg';
import { ReactComponent as ArrowUpIcon } from 'img/icons/arrow-up.svg';
import { ReactComponent as BookIcon } from 'img/icons/book.svg';
import { ReactComponent as CalculatorIcon } from 'img/icons/calculator.svg';
import { ReactComponent as CheckStrokeIcon } from 'img/icons/check-stroke.svg';
import { ReactComponent as ConfigIcon } from 'img/icons/config.svg';
import { ReactComponent as CreditCardIcon } from 'img/icons/credit-card.svg';
import { ReactComponent as CrossIcon } from 'img/icons/cross.svg';
import { ReactComponent as DocumentAddIcon } from 'img/icons/document-add.svg';
import { ReactComponent as DocumentDuplicateIcon } from 'img/icons/document-duplicate.svg';
import { ReactComponent as DocumentIcon } from 'img/icons/document.svg';
import { ReactComponent as DollarIcon } from 'img/icons/dollar.svg';
import { ReactComponent as EditIcon } from 'img/icons/edit.svg';
import { ReactComponent as EmailIcon } from 'img/icons/email.svg';
import { ReactComponent as EyeOffIcon } from 'img/icons/eye-off.svg';
import { ReactComponent as EyeOnIcon } from 'img/icons/eye-on.svg';
import { ReactComponent as FAQIcon } from 'img/icons/faq.svg';
import { ReactComponent as FileIcon } from 'img/icons/file.svg';
import { ReactComponent as HeartIcon } from 'img/icons/heart.svg';
import { ReactComponent as HomeIcon } from 'img/icons/home.svg';
import { ReactComponent as InfoCircleIcon } from 'img/icons/info-circle.svg';
import { ReactComponent as OfficeIcon } from 'img/icons/office.svg';
import { ReactComponent as PhoneIcon } from 'img/icons/phone.svg';
import { ReactComponent as PlusIcon } from 'img/icons/plus.svg';
import { ReactComponent as SaveIcon } from 'img/icons/save.svg';
import { ReactComponent as SearchIcon } from 'img/icons/search.svg';
import { ReactComponent as SettingsIcon } from 'img/icons/settings.svg';
import { ReactComponent as ShareIcon } from 'img/icons/share.svg';
import { ReactComponent as SpinnerIcon } from 'img/icons/spinner.svg';
import { ReactComponent as StarIcon } from 'img/icons/star.svg';
import { ReactComponent as SupportIcon } from 'img/icons/support.svg';
import { ReactComponent as TrashIcon } from 'img/icons/trash.svg';
import { ReactComponent as TriangleIcon } from 'img/icons/triangle.svg';
import { ReactComponent as UserCircleIcon } from 'img/icons/user-circle.svg';
import { ReactComponent as UserIcon } from 'img/icons/user.svg';
import { ReactComponent as UsersIcon } from 'img/icons/users.svg';

const icons = {
  'add-person': AddPersonIcon,
  'arrow-circle-up': ArrowCircleUpIcon,
  'arrow-down': ArrowDownIcon,
  'arrow-up': ArrowUpIcon,
  'check-stroke': CheckStrokeIcon,
  'credit-card': CreditCardIcon,
  'document-add': DocumentAddIcon,
  'document-duplicate': DocumentDuplicateIcon,
  'eye-off': EyeOffIcon,
  'eye-on': EyeOnIcon,
  'info-circle': InfoCircleIcon,
  'user-circle': UserCircleIcon,
  alert: AlertIcon,
  book: BookIcon,
  calculator: CalculatorIcon,
  config: ConfigIcon,
  cross: CrossIcon,
  document: DocumentIcon,
  dollar: DollarIcon,
  edit: EditIcon,
  email: EmailIcon,
  faq: FAQIcon,
  file: FileIcon,
  heart: HeartIcon,
  home: HomeIcon,
  office: OfficeIcon,
  phone: PhoneIcon,
  plus: PlusIcon,
  save: SaveIcon,
  search: SearchIcon,
  settings: SettingsIcon,
  share: ShareIcon,
  spinner: SpinnerIcon,
  star: StarIcon,
  support: SupportIcon,
  trash: TrashIcon,
  triangle: TriangleIcon,
  user: UserIcon,
  users: UsersIcon,
};

const Icon = ({ name, className, spin, ...props }) => {
  const IconByType = icons[name];

  if (!IconByType) return null;

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <IconByType name={name} className={classNames('icon', { spin }, className)} {...props} />;
};

export default Icon;
