import React from 'react'
import { Modal } from 'semantic-ui-react'

const TermsAndConditions = ({ trigger }) => (
  <Modal
    dimmer="inverted"
    closeIcon
    trigger={trigger}
  >
    <Modal.Header>Terms and Conditions</Modal.Header>
    <Modal.Content>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Praesent nulla leo, interdum vel auctor vitae, ultricies ut diam.
      Mauris maximus aliquet eros, sit amet cursus risus semper ac.
      Proin at ligula eget lacus accumsan sagittis non vehicula tellus.
      Morbi facilisis suscipit purus in aliquam. Cras sed metus euismod, ultrices sem quis, pulvinar neque.
      Phasellus ultrices lectus neque, eu ullamcorper sem maximus ac. Mauris quis odio congue, ultrices magna dapibus, cursus quam.
      Donec convallis mauris sed lobortis pellentesque. Duis ultrices ut velit ut hendrerit.
      Mauris pulvinar, massa nec sodales mollis, nunc nisi accumsan erat, non accumsan turpis lorem nec neque.
      Ut tincidunt elit nulla, non molestie tortor hendrerit ac. Donec suscipit dolor at turpis dictum finibus.
      Nam pretium sapien sit amet ipsum viverra convallis. Curabitur sodales dui dolor, eu faucibus justo interdum sed.
      Maecenas euismod, purus et auctor porta, velit tellus mollis mi, id vehicula nunc ipsum nec arcu.
      Maecenas sem diam, tempus id viverra ac, volutpat sit amet turpis.
      In tempus, turpis a consectetur vehicula, ante sapien vehicula nibh, a rutrum neque purus eget justo.

      Phasellus ac ultrices dui. Donec sodales ligula quis arcu accumsan molestie.
      Phasellus a viverra mauris, vitae malesuada erat. Ut sed lacus eu dui viverra iaculis.
      Fusce elit erat, mattis a enim eu, commodo sodales nibh. Nullam ac pharetra eros.
      In ac odio elementum, dignissim arcu at, auctor mauris. Nullam risus turpis, varius et neque vel, ultrices feugiat turpis.
      Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
    </Modal.Content>
  </Modal>
)

export default TermsAndConditions
