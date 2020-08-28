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
               value={getSetting('remove', true)}
               onChange={() => toggleSetting('remove')}
            >
               Remove
            </SwitchItem>
            <SwitchItem
               note={'Display notifications when you get kicked from a server.'}
               value={getSetting('kick', true)}
               onChange={() => toggleSetting('kick')}
            >
               Kick
            </SwitchItem>
            <SwitchItem
               note={'Display notifications when you get banned from a server.'}
               value={getSetting('ban', true)}
               onChange={() => toggleSetting('ban')}
            >
               Ban
            </SwitchItem>
            <SwitchItem
               note={'Display notifications when you get kicked from a group chat.'}
               value={getSetting('group', true)}
               onChange={() => toggleSetting('group')}
            >
               Group
            </SwitchItem>
            <Category
               name={'Text'}
               description={'Customize the notifications the way you want.'}
               opened={getSetting('textExpanded', false)}
               onChange={() => updateSetting('textExpanded', !getSetting('textExpanded', false))}
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
                  value={getSetting('removeTitle', 'Someone removed you')}
                  onChange={(v) => updateSetting('removeTitle', v)}
                  note={'The title the notification will have when someone removes you.'}
               >
                  Removed Title
               </TextInput>
               <TextInput
                  value={getSetting('removeText', 'Tag: %username#%usertag')}
                  onChange={(v) => updateSetting('removeText', v)}
                  note={'The text the notification will have when someone removes you.'}
               >
                  Removed Text
               </TextInput>
               <TextInput
                  value={getSetting('kickTitle', "You've been kicked")}
                  onChange={(v) => updateSetting('kickTitle', v)}
                  note={'The title the notification will have when you get kicked from a server.'}
               >
                  Kicked Title
               </TextInput>
               <TextInput
                  value={getSetting('kickText', 'Server Name: %servername')}
                  onChange={(v) => updateSetting('kickText', v)}
                  note={'The text the notification will have when you get kicked from a server.'}
               >
                  Kicked Text
               </TextInput>
               <TextInput
                  value={getSetting('banTitle', "You've been banned")}
                  onChange={(v) => updateSetting('banTitle', v)}
                  note={'The title the notification will have when you get banned from a server.'}
               >
                  Banned Title
               </TextInput>
               <TextInput
                  value={getSetting('banText', 'Server Name: %servername')}
                  onChange={(v) => updateSetting('banText', v)}
                  note={'The text the notification will have when you get banned from a server.'}
               >
                  Banned Text
               </TextInput>
               <TextInput
                  value={getSetting('groupTitle', "You've been kicked from a group")}
                  onChange={(v) => updateSetting('groupTitle', v)}
                  note={'The title the notification will have when you get kicked from a group chat.'}
               >
                  Group Title
               </TextInput>
               <TextInput
                  value={getSetting('groupText', 'Group Name: %groupname')}
                  onChange={(v) => updateSetting('groupText', v)}
                  note={'The text the notification will have when you get kicked from a group chat.'}
               >
                  Group Text
               </TextInput>
               <TextInput
                  value={getSetting('buttonText', 'Fuck %name')}
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
