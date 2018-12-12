// Lots of copy/pasted functions in this file, this implementation isn't permenant... hopefully.

'use strict';
$(function() {
	var runDataActiveRunReplicant = nodecg.Replicant("runDataActiveRun");
	runDataActiveRunReplicant.on("change", function (newValue, oldValue) {
		if (typeof newValue !== 'undefined' && newValue != '') {
			if (newValue.teams.length > 1)
				playerLayout_UpdateLayoutPanelWithTeams(newValue.teams);
			else if (newValue.teams.length === 1)
				playerLayout_UpdateLayoutPanelWithPlayers(newValue.teams[0]);
		}
	});
	
	function playerLayout_UpdateLayoutPanelWithTeams(runners) {
		var playersSortableHTML = '' +
			'<ul id="playerLayoutSortable">' +
			playerLayout_CreateTeamListHtmlElements(runners) +
			'</ul>';
		$('#playerLayoutContainer').html(playersSortableHTML);
		$("#playerLayoutSortable").sortable({
			stop: function (event, ui) {
				// IE doesn't register the blur when sorting
				// so trigger focusout handlers to remove .ui-state-focus
				var sortedIDs = $('#playerLayoutSortable').sortable("toArray");
				var oldTeamArray = runDataActiveRunReplicant.value.teams;
				var newTeamArray = [];
				$.each(sortedIDs, function (index, valueId) {
					$.each(oldTeamArray, function (index, team) {
						if (team.ID == valueId) {
							newTeamArray.push(team);
							return false;
						}
					});
				});
				runDataActiveRunReplicant.value.teams = newTeamArray;
			}
		});
		
		$("#playerLayoutSortable").disableSelection();
	}
	
	function playerLayout_CreateTeamListHtmlElements(teamArray) {
		var runnerHtml = '';
		$.each(teamArray, function (index, team) {
			var teamPlayers = [];
			if (team.players.length === 1) {
				team.players.forEach(function(player) {teamPlayers.push(player.name);});
				var teamName = teamPlayers.join(', ');
			}
			else if (team.name) var teamName = team.name;
			else var teamName = `Team ${index+1}`
			runnerHtml += '<li class="ui-state-default" id="' + team.ID + '" title="'+teamPlayers.join(', ')+'">' + teamName + '</li>';
		});
		return runnerHtml;
	}
	
	function playerLayout_UpdateLayoutPanelWithPlayers(runners) {
		var playersSortableHTML = '' +
			'<ul id="playerLayoutSortable">' +
			playerLayout_CreatePlayerListHtmlElements(runners) +
			'</ul>';
		$('#playerLayoutContainer').html(playersSortableHTML);
		$("#playerLayoutSortable").sortable({
			stop: function (event, ui) {
				// IE doesn't register the blur when sorting
				// so trigger focusout handlers to remove .ui-state-focus
				var sortedIDs = $('#playerLayoutSortable').sortable("toArray");
				var oldPlayerArray = runDataActiveRunReplicant.value.teams[0].players;
				var newPlayerArray = [];
				$.each(sortedIDs, function (index, valueId) {
					$.each(oldPlayerArray, function (index, player) {
						if (player.name == valueId) {
							newPlayerArray.push(player);
							return false;
						}
					});
				});
				runDataActiveRunReplicant.value.teams[0].players = newPlayerArray;
			}
		});
		
		$("#playerLayoutSortable").disableSelection();
	}
	
	function playerLayout_CreatePlayerListHtmlElements(playerArray) {
		var runnerHtml = '';
		$.each(playerArray.players, function (index, value) {
			runnerHtml += '<li class="ui-state-default" id="' + value.name + '">' + value.name + '</li>';
		});
		return runnerHtml;
	}
});