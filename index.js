const { Plugin } = require('powercord/entities')
const { inject, uninject } = require('powercord/injector')
const { FluxDispatcher: Dispatcher, getModule } = require('powercord/webpack')
const Settings = require('./components/Settings')

module.exports = class extends Plugin {
   async startPlugin() {
      if (!this.settings.get('textExpanded')) this.settings.set('textExpanded', false)
      if (!this.settings.get('remove')) this.settings.set('remove', true)
      if (!this.settings.get('kick')) this.settings.set('kick', true)
      if (!this.settings.get('ban')) this.settings.set('ban', true)
      if (!this.settings.get('removeTitle')) this.settings.set('removeTitle', 'Someone removed you')
      if (!this.settings.get('kickTitle')) this.settings.set('kickTitle', "You've been kicked")
      if (!this.settings.get('banTitle')) this.settings.set('banTitle', "You've been banned")
      if (!this.settings.get('removeText')) this.settings.set('removeText', 'Tag: %username#%usertag')
      if (!this.settings.get('kickText')) this.settings.set('kickText', 'Server Name: %servername')
      if (!this.settings.get('banText')) this.settings.set('banText', 'Server Name: %servername')
      if (!this.settings.get('buttonText')) this.settings.set('buttonText', 'Fuck %usernameorservername')

      powercord.api.settings.registerSettings('relationships-notifier', {
         category: this.entityID,
         label: 'Relationships Notifier',
         render: Settings
      })

      this.userStore = await getModule(['getCurrentUser', 'getUser'])
      this.guildStore = await getModule(['getGuild', 'getGuilds'])

      this.cachedGuilds = [...Object.values(this.guildStore.getGuilds())]

      Dispatcher.subscribe('RELATIONSHIP_REMOVE', this.relationshipCallback)
      Dispatcher.subscribe('GUILD_MEMBER_REMOVE', this.memberRemoveCallback)
      Dispatcher.subscribe('GUILD_BAN_ADD', this.banCallback)
      Dispatcher.subscribe('GUILD_CREATE', this.guildCreate)

      this.mostRecentlyRemovedID = null
      this.mostRecentlyLeftGuild = null

      const relationshipModule = await getModule(['removeRelationship'])
      inject('rn-relationship-check', relationshipModule, 'removeRelationship', (args, res) => {
         this.mostRecentlyRemovedID = args[0]
         return res
      })

      const leaveGuild = await getModule(['leaveGuild'])
      inject('rn-guild-leave-check', leaveGuild, 'leaveGuild', (args, res) => {
         this.mostRecentlyLeftGuild = args[0]
         this.removeGuildFromCache(args[0])
         return res
      })
   }

   pluginWillUnload() {
      powercord.api.settings.unregisterSettings('relationships-notifier')
      uninject('rn-relationship-check')
      uninject('rn-guild-join-check')
      uninject('rn-guild-leave-check')
      Dispatcher.unsubscribe('RELATIONSHIP_REMOVE', this.relationshipCallback)
      Dispatcher.unsubscribe('GUILD_MEMBER_REMOVE', this.memberRemoveCallback)
      Dispatcher.unsubscribe('GUILD_BAN_ADD', this.banCallback)
      Dispatcher.unsubscribe('GUILD_CREATE', this.guildCreate)
   }

   banCallback = (data) => {
      if (data.user.id !== this.userStore.getCurrentUser().id) return
      let guild = this.cachedGuilds.find((g) => g.id == data.guildId)
      if (!guild || guild === null) return
      this.removeGuildFromCache(guild.id)
      powercord.api.notices.sendToast(`rn_${this.random(20)}`, {
         header: this.replaceWithVars('ban', this.settings.get('banTitle'), guild),
         content: this.replaceWithVars('ban', this.settings.get('banText'), guild),
         type: 'danger',
         buttons: [
            {
               text: this.replaceWithVars('button', this.settings.get('buttonText'), guild),
               color: 'red',
               size: 'small',
               look: 'outlined'
            }
         ]
      })
   }

   guildCreate = (data) => {
      this.cachedGuilds.push(data.guild)
   }

   relationshipCallback = (data) => {
      if (data.relationship.type === 3 || data.relationship.type === 4) return
      if (this.mostRecentlyRemovedID === data.relationship.id) {
         this.mostRecentlyRemovedID = null
         return
      }
      let user = this.userStore.getUser(data.relationship.id)
      if (!user || user === null) return
      powercord.api.notices.sendToast(`rn_${this.random(20)}`, {
         header: this.replaceWithVars('remove', this.settings.get('removeTitle'), user),
         content: this.replaceWithVars('remove', this.settings.get('removeText'), user),
         type: 'danger',
         buttons: [
            {
               text: this.replaceWithVars('button', this.settings.get('buttonText'), user),
               color: 'red',
               size: 'small',
               look: 'outlined'
            }
         ]
      })
      this.mostRecentlyRemovedID = null
   }

   memberRemoveCallback = (data) => {
      if (this.mostRecentlyLeftGuild === data.guildId) {
         this.mostRecentlyLeftGuild = null
         return
      }
      if (data.user.id !== this.userStore.getCurrentUser().id) return
      let guild = this.cachedGuilds.find((g) => g.id == data.guildId)
      if (!guild || guild === null) return
      this.removeGuildFromCache(guild.id)
      powercord.api.notices.sendToast(`rn_${this.random(20)}`, {
         header: this.replaceWithVars('kick', this.settings.get('kickTitle'), guild),
         content: this.replaceWithVars('kick', this.settings.get('kickText'), guild),
         type: 'danger',
         buttons: [
            {
               text: this.replaceWithVars('button', this.settings.get('buttonText'), guild),
               color: 'red',
               size: 'small',
               look: 'outlined'
            }
         ]
      })
      this.mostRecentlyLeftGuild = null
   }

   removeGuildFromCache(id) {
      const index = this.cachedGuilds.indexOf(this.cachedGuilds.find((g) => g.id == id))
      if (index == -1) return
      this.cachedGuilds.splice(index, 1)
   }

   random() {
      var result = ''
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      for (var i = 0; i < length; i++) {
         result += characters.charAt(Math.floor(Math.random() * characters.length))
      }
      return result
   }

   replaceWithVars(type, text, serverOrUser) {
      if (type === 'remove') {
         return text
            .replace('%username', serverOrUser.username)
            .replace('%usertag', serverOrUser.discriminator)
            .replace('%userid', serverOrUser.id)
      } else if (['ban', 'kick'].includes(type)) {
         return text.replace('%servername', serverOrUser).replace('%serverid', serverOrUser.id)
      } else if (type === 'button') {
         return text.replace('%usernameorservername', serverOrUser.username ? serverOrUser.username : serverOrUser.name)
      }
   }
}
