/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var App = require('app');
var dateUtils = require('utils/date');

App.AlertInstance = DS.Model.extend({
  id: DS.attr('number'),
  label: DS.attr('string'),
  definitionName: DS.attr('string'),
  definitionId: DS.attr('number'),
  service: DS.belongsTo('App.Service'),
  serviceName: DS.attr('string'),
  componentName: DS.attr('string'),
  host: DS.belongsTo('App.Host'),
  scope: DS.attr('string'),
  originalTimestamp: DS.attr('number'),
  latestTimestamp: DS.attr('number'),
  maintenanceState: DS.attr('string'),
  instance: DS.attr('string'),
  state: DS.attr('string'),
  text: DS.attr('string'),
  notification: DS.hasMany('App.AlertNotification'),

  /**
   * Status icon markup
   * @type {string}
   */
  status: function () {
    var state = this.get('state');
    return '<span class="label alert-state-single-host alert-state-' + state + '">' + state + '</span>';
  }.property('state'),

  /**
   * For alerts we will have processes which are not typical
   * cluster services - like Ambari-Server. This method unifies
   * cluster services and other services into a common display-name.
   * @see App.AlertDefinition#serviceDisplayName()
   */
  serviceDisplayName : function() {
    var serviceName = this.get('service.displayName');
    if (!serviceName) {
      serviceName = this.get('serviceName');
      if (serviceName) {
        serviceName = serviceName.toCapital();
      }
    }
    return serviceName;
  }.property('serviceName', 'service.displayName'),

  /**
   * Formatted timestamp for latest instance triggering
   * @type {string}
   */
  lastTriggeredFormatted: function() {
    return dateUtils.dateFormat(this.get('originalTimestamp'));
  }.property('originalTimestamp'),

  /**
   * Formatted timestamp with <code>$.timeago</code>
   * @type {string}
   */
  lastTriggeredAgoFormatted: function () {
    var lastTriggered = this.get('originalTimestamp');
    return lastTriggered ? $.timeago(new Date(lastTriggered)): '';
  }.property('originalTimestamp'),

  /**
   * List of css-classes for alert instance status
   * @type {object}
   */
  typeIcons: {
    'DISABLED': 'icon-off'
  }
});

App.AlertInstance.FIXTURES = [];
