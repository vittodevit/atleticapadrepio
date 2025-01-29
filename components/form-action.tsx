import React from 'react';

interface FormActionProps {
  create?: boolean;
  update?: boolean;
  remove?: boolean;
  changePassword?: boolean;
}

export const FormAction: React.FC<FormActionProps> = ({ create, update, remove, changePassword }) => {
  return (
    <div>
      {create && <input type='hidden' name='action' value='create' />}
      {update && <input type='hidden' name='action' value='update' />}
      {remove && <input type='hidden' name='action' value='remove' />}
      {changePassword && <input type='hidden' name='action' value='changePassword' />}
    </div>
  );
};

interface ObjectIdProps {
  objectId: string | undefined;
}

export const ObjectId: React.FC<ObjectIdProps> = ({ objectId }) => {
  return ( (objectId === '' || objectId === undefined) ? null :
      <div>
        <input type="hidden" name='objectId' value={objectId} />
      </div>
  );
};