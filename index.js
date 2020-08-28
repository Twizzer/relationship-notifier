const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { FluxDispatcher: Dispatcher, getModule } = require('powercord/webpack');
const Settings = require('./components/Settings');

module.exports = class RelationshipsNotifier extends Plugin {
   async startPlugin() {
      powercord.api.settings.registerSettings('relationships-notifier', {
         category: this.entityID,
         label: 'Relationships Notifier',
         render: Settings
      });

      this.userStore = await getModule(['getCurrentUser', 'getUser']);
      this.guildStore = await getModule(['getGuild', 'getGuilds']);
      this.channelStore = await getModule(['getChannel', 'getChannels']);

      this.cachedGroups = [...Object.values(this.channelStore.getChannels())].filter((c) => c.type === 3);
      this.cachedGuilds = [...Object.values(this.guildStore.getGuilds())];

      Dispatcher.subscribe('RELATIONSHIP_REMOVE', this.relationshipRemove);
      Dispatcher.subscribe('GUILD_MEMBER_REMOVE', this.memberRemove);
      Dispatcher.subscribe('GUILD_BAN_ADD', this.ban);
      Dispatcher.subscribe('GUILD_CREATE', this.guildCreate);
      Dispatcher.subscribe('CHANNEL_CREATE', this.channelCreate);
      Dispatcher.subscribe('CHANNEL_DELETE', this.channelDelete);

      this.mostRecentlyRemovedID = null;
      this.mostRecentlyLeftGuild = null;
      this.mostRecentlyLeftGroup = null;

      const relationshipModule = await getModule(['removeRelationship']);
      inject('rn-relationship-check', relationshipModule, 'removeRelationship', (args, res) => {
         this.mostRecentlyRemovedID = args[0];
         return res;
      });

      const leaveGuild = await getModule(['leaveGuild']);
      inject('rn-guild-leave-check', leaveGuild, 'leaveGuild', (args, res) => {
         this.mostRecentlyLeftGuild = args[0];
         this.removeGuildFromCache(args[0]);
         return res;
      });

      const closePrivateChannel = await getModule(['closePrivateChannel']);
      inject('rn-group-check', closePrivateChannel, 'closePrivateChannel', (args, res) => {
         this.mostRecentlyLeftGroup = args[0];
         this.removeGroupFromCache(args[0]);
         return res;
      });
   }

   pluginWillUnload() {
      powercord.api.settings.unregisterSettings('relationships-notifier');
      uninject('rn-relationship-check');
      uninject('rn-guild-join-check');
      uninject('rn-guild-leave-check');
      uninject('rn-group-check');
      Dispatcher.unsubscribe('RELATIONSHIP_REMOVE', this.relationshipRemove);
      Dispatcher.unsubscribe('GUILD_MEMBER_REMOVE', this.memberRemove);
      Dispatcher.unsubscribe('GUILD_BAN_ADD', this.ban);
      Dispatcher.unsubscribe('GUILD_CREATE', this.guildCreate);
      Dispatcher.unsubscribe('CHANNEL_CREATE', this.channelCreate);
      Dispatcher.unsubscribe('CHANNEL_DELETE', this.channelDelete);
   }

   guildCreate = (data) => {
      this.cachedGuilds.push(data.guild);
   };

   channelCreate = (data) => {
      if ((data.channel && data.channel.type !== 3) || this.cachedGroups.find((g) => g.id === data.channel.id)) return;
      this.cachedGroups.push(data.channel);
   };

   channelDelete = (data) => {
      if ((data.channel && data.channel.type !== 3) || !this.cachedGroups.find((g) => g.id === data.channel.id)) return;
      let channel = this.cachedGroups.find((g) => g.id == data.channel.id);
      if (!channel || channel === null) return;
      this.removeGroupFromCache(channel.id);
      if (this.settings.get('group', true)) {
         powercord.api.notices.sendToast(`rn_${this.random(20)}`, {
            header: this.replaceWithVars('group', this.settings.get('groupTitle', "You've kicked from a group"), channel),
            content: this.replaceWithVars('group', this.settings.get('groupText', 'Group Name: %groupname'), channel),
            type: 'danger',
            buttons: [
               {
                  text: this.replaceWithVars('button', this.settings.get('buttonText', 'Fuck %name'), channel),
                  color: 'red',
                  size: 'small',
                  look: 'outlined'
               }
            ]
         });
      }
   };

   removeGroupFromCache = (id) => {
      const index = this.cachedGroups.indexOf(this.cachedGroups.find((g) => g.id == id));
      if (index == -1) return;
      this.cachedGroups.splice(index, 1);
   };

   removeGuildFromCache = (id) => {
      const index = this.cachedGuilds.indexOf(this.cachedGuilds.find((g) => g.id == id));
      if (index == -1) return;
      this.cachedGuilds.splice(index, 1);
   };

   ban = (data) => {
      if (data.user.id !== this.userStore.getCurrentUser().id) return;
      let guild = this.cachedGuilds.find((g) => g.id == data.guildId);
      if (!guild || guild === null) return;
      this.removeGuildFromCache(guild.id);
      if (this.settings.get('ban', true)) {
         powercord.api.notices.sendToast(`rn_${this.random(20)}`, {
            header: this.replaceWithVars('ban', this.settings.get('banTitle', "You've been banned"), guild),
            content: this.replaceWithVars('ban', this.settings.get('banText', 'Server Name: %servername'), guild),
            type: 'danger',
            buttons: [
               {
                  text: this.replaceWithVars('button', this.settings.get('buttonText', 'Fuck %name'), guild),
                  color: 'red',
                  size: 'small',
                  look: 'outlined'
               }
            ]
         });
      }
   };

   relationshipRemove = (data) => {
      if (data.relationship.type === 3 || data.relationship.type === 4) return;
      if (this.mostRecentlyRemovedID === data.relationship.id) {
         this.mostRecentlyRemovedID = null;
         return;
      }
      let user = this.userStore.getUser(data.relationship.id);
      if (!user || user === null) return;
      if (this.settings.get('remove', true)) {
         powercord.api.notices.sendToast(`rn_${this.random(20)}`, {
            header: this.replaceWithVars('remove', this.settings.get('removeTitle', 'Someone removed you'), user),
            content: this.replaceWithVars('remove', this.settings.get('removeText', 'Tag: %username#%usertag'), user),
            type: 'danger',
            buttons: [
               {
                  text: this.replaceWithVars('button', this.settings.get('buttonText', 'Fuck %name'), user),
                  color: 'red',
                  size: 'small',
                  look: 'outlined'
               }
            ]
         });
      }
      this.mostRecentlyRemovedID = null;
   };

   memberRemove = (data) => {
      if (this.mostRecentlyLeftGuild === data.guildId) {
         this.mostRecentlyLeftGuild = null;
         return;
      }
      if (data.user.id !== this.userStore.getCurrentUser().id) return;
      let guild = this.cachedGuilds.find((g) => g.id == data.guildId);
      if (!guild || guild === null) return;
      this.removeGuildFromCache(guild.id);
      if (this.settings.get('kick', true)) {
         powercord.api.notices.sendToast(`rn_${this.random(20)}`, {
            header: this.replaceWithVars('kick', this.settings.get('kickTitle', "You've been kicked"), guild),
            content: this.replaceWithVars('kick', this.settings.get('kickText', 'Server Name: %servername'), guild),
            type: 'danger',
            buttons: [
               {
                  text: this.replaceWithVars('button', this.settings.get('buttonText', 'Fuck %name'), guild),
                  color: 'red',
                  size: 'small',
                  look: 'outlined'
               }
            ]
         });
      }
      this.mostRecentlyLeftGuild = null;
   };

   random() {
      var result = '';
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (var i = 0; i < length; i++) {
         result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return result;
   }

   replaceWithVars(type, text, object) {
      if (type === 'remove') {
         return text.replace('%username', object.username).replace('%usertag', object.discriminator).replace('%userid', object.id);
      } else if (['ban', 'kick'].includes(type)) {
         return text.replace('%servername', object.name).replace('%serverid', object.id);
      } else if (type === 'button' && !object.type) {
         return text.replace('%name', object.username ? object.username : object.name);
      } else if (type === 'group') {
         let name = object.name.length === 0 ? object.recipients.map((id) => this.userStore.getUser(id).username).join(', ') : object.name;
         return text.replace('%groupname', name).replace('%groupid', object.id);
      } else {
         let name = object.name.length === 0 ? object.recipients.map((id) => this.userStore.getUser(id).username).join(', ') : object.name;
         return text.replace('%name', name);
      }
   }
};
