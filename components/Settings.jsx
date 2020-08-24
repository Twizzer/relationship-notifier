const { React, getModuleByDisplayName } = require('powercord/webpack')
const { Button, AsyncComponent } = require('powercord/components')
const { TextInput, Category, SwitchItem } = require('powercord/components/settings')
const FormText = AsyncComponent.from(getModuleByDisplayName('FormText'))
const FormTitle = AsyncComponent.from(getModuleByDisplayName('FormTitle'))

module.exports = class Settings extends React.Component {
   constructor(props) {
      super()
   }

   render() {
      const { getSetting, updateSetting, toggleSetting } = this.props
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
               <FormTitle>Remove Variables</FormTitle>
               <FormText>%username, %userid, %usertag</FormText>
               <br></br>
               <FormTitle>Kick & Ban Variables</FormTitle>
               <FormText>%servername, %serverid</FormText>
               <br></br>
               <FormTitle>Button Variables</FormTitle>
               <FormText>%name (Adapts to type of notification)</FormText>
               <br></br>
               <FormTitle>Group Variables</FormTitle>
               <FormText>%groupname, %groupid</FormText>
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
      )
   }
}
