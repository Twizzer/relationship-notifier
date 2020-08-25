const { React, getModuleByDisplayName, getModule } = require('powercord/webpack');
const { Button, AsyncComponent } = require('powercord/components');
const { TextInput, Category, SwitchItem } = require('powercord/components/settings');
const FormText = AsyncComponent.from(getModuleByDisplayName('FormText'));
const FormTitle = AsyncComponent.from(getModuleByDisplayName('FormTitle'));
const Flex = AsyncComponent.from(getModuleByDisplayName('flex'));
const FlexChild = getModule(['flexChild'], false).flexChild;

module.exports = class Settings extends React.Component {
   constructor(props) {
      super();
   }

   render() {
      const { getSetting, updateSetting, toggleSetting } = this.props;
      return (
         <div>
            <SwitchItem
               note={'Display notifications when someone removes you from their friends list.'}
               value={getSetting('remove')}
               onChange={() => toggleSetting('remove')}
            >
               Remove
            </SwitchItem>
            <SwitchItem
               note={'Display notifications when you get kicked from a server.'}
               value={getSetting('kick')}
               onChange={() => toggleSetting('kick')}
            >
               Kick
            </SwitchItem>
            <SwitchItem
               note={'Display notifications when you get banned from a server.'}
               value={getSetting('ban')}
               onChange={() => toggleSetting('ban')}
            >
               Ban
            </SwitchItem>
            <SwitchItem
               note={'Display notifications when you get kicked from a group chat.'}
               value={getSetting('group')}
               onChange={() => toggleSetting('group')}
            >
               Group
            </SwitchItem>
            <Category
               name={'Text'}
               description={'Customize the notifications the way you want.'}
               opened={getSetting('textExpanded')}
               onChange={() => updateSetting('textExpanded', !getSetting('textExpanded'))}
            >
               <Flex style={{ justifyContent: 'center' }}>
                  <div className={FlexChild}>
                     <FormTitle>Remove Variables</FormTitle>
                     <FormText style={{ textAlign: 'center' }}>
                        %username
                        <br></br>
                        %userid
                        <br></br>
                        %usertag
                     </FormText>
                  </div>
                  <div className={FlexChild}>
                     <FormTitle>Kick & Ban Variables</FormTitle>
                     <FormText style={{ textAlign: 'center' }}>
                        %servername
                        <br></br>
                        %serverid
                     </FormText>
                  </div>
                  <div className={FlexChild}>
                     <FormTitle>Button Variables</FormTitle>
                     <FormText style={{ textAlign: 'center' }}>%name</FormText>
                  </div>
                  <div className={FlexChild}>
                     <FormTitle>Group Variables</FormTitle>
                     <FormText style={{ textAlign: 'center' }}>
                        %groupname
                        <br></br>
                        %groupid
                     </FormText>
                  </div>
               </Flex>
               <br></br>
               <TextInput
                  value={getSetting('removeTitle')}
                  onChange={(v) => updateSetting('removeTitle', v)}
                  note={'The title the notification will have when someone removes you.'}
               >
                  Removed Title
               </TextInput>
               <TextInput
                  value={getSetting('removeText')}
                  onChange={(v) => updateSetting('removeText', v)}
                  note={'The text the notification will have when someone removes you.'}
               >
                  Removed Text
               </TextInput>
               <TextInput
                  value={getSetting('kickTitle')}
                  onChange={(v) => updateSetting('kickTitle', v)}
                  note={'The title the notification will have when you get kicked from a server.'}
               >
                  Kicked Title
               </TextInput>
               <TextInput
                  value={getSetting('kickText')}
                  onChange={(v) => updateSetting('kickText', v)}
                  note={'The text the notification will have when you get kicked from a server.'}
               >
                  Kicked Text
               </TextInput>
               <TextInput
                  value={getSetting('banTitle')}
                  onChange={(v) => updateSetting('banTitle', v)}
                  note={'The title the notification will have when you get banned from a server.'}
               >
                  Banned Title
               </TextInput>
               <TextInput
                  value={getSetting('banText')}
                  onChange={(v) => updateSetting('banText', v)}
                  note={'The text the notification will have when you get banned from a server.'}
               >
                  Banned Text
               </TextInput>
               <TextInput
                  value={getSetting('groupTitle')}
                  onChange={(v) => updateSetting('groupTitle', v)}
                  note={'The title the notification will have when you get kicked from a group chat.'}
               >
                  Group Title
               </TextInput>
               <TextInput
                  value={getSetting('groupText')}
                  onChange={(v) => updateSetting('groupText', v)}
                  note={'The text the notification will have when you get kicked from a group chat.'}
               >
                  Group Text
               </TextInput>
               <TextInput
                  value={getSetting('buttonText')}
                  onChange={(v) => updateSetting('buttonText', v)}
                  note={"The text the notification's confirm button will have."}
               >
                  Button Text
               </TextInput>
            </Category>
         </div>
      );
   }
};
