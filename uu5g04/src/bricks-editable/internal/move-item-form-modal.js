import React from "react";
import PropTypes from "prop-types";
import * as UU5 from "uu5g04";
import ns from "../bricks-editable-ns.js";

export const MoveItemFormModal = React.forwardRef((props, ref) => {
  let { onSave, onCancel, maxPosition, currentPosition, ...modalProps } = props;

  return (
    <UU5.Bricks.PortalModal onClose={props.onClose} {...modalProps} ref_={ref}>
      <UU5.Forms.Form onSave={onSave} onCancel={onCancel}>
        {/* value is +1 because it was received as an index */}
        <UU5.Forms.Number name="position" valueType="number" min={1} max={maxPosition} value={currentPosition + 1} />
        <UU5.Forms.Controls />
      </UU5.Forms.Form>
    </UU5.Bricks.PortalModal>
  );
});

MoveItemFormModal.displayName = ns.name("MoveItemFormModal");
MoveItemFormModal.tagName = ns.name("MoveItemFormModal");
MoveItemFormModal.isStateless = true;
MoveItemFormModal.propTypes = {
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  currentPosition: PropTypes.number,
  maxPosition: PropTypes.number
};
MoveItemFormModal.defaultProps = {
  onClose: undefined,
  onSave: undefined,
  onCancel: undefined,
  currentPosition: 0,
  maxPosition: 0
};

export default MoveItemFormModal;