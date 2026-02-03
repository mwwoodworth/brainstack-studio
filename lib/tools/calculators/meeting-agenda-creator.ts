// Meeting Agenda Creator - Generate structured meeting agendas
import { ToolResult } from '../types';
import { calculateInputConfidence, getConfidenceLevel } from '../utils';

export function executeMeetingAgendaCreator(
  inputs: Record<string, string | number>
): ToolResult {
  const meetingTitle = String(inputs.meetingTitle || 'Team Meeting');
  const meetingType = String(inputs.meetingType || 'general');
  const duration = Number(inputs.duration) || 60;
  const attendeeCount = Number(inputs.attendeeCount) || 5;
  const meetingDate = String(inputs.meetingDate || new Date().toLocaleDateString());
  const organizer = String(inputs.organizer || 'Meeting Organizer');

  const decisionTrail: string[] = [];
  decisionTrail.push(`Creating agenda for: ${meetingTitle}`);
  decisionTrail.push(`Meeting type: ${meetingType}, Duration: ${duration} min`);

  // Parse topics (up to 8)
  const topics: { name: string; owner: string; minutes: number }[] = [];
  let totalAllocated = 0;

  for (let i = 1; i <= 8; i++) {
    const topicName = String(inputs[`topic${i}`] || '').trim();
    if (topicName) {
      const topicMinutes = Number(inputs[`topic${i}Minutes`]) || Math.floor(duration / 6);
      topics.push({
        name: topicName,
        owner: String(inputs[`topic${i}Owner`] || 'TBD'),
        minutes: topicMinutes,
      });
      totalAllocated += topicMinutes;
    }
  }

  decisionTrail.push(`Parsed ${topics.length} agenda topics`);

  if (topics.length === 0) {
    return {
      summary: 'No topics provided. Please add at least one discussion topic.',
      confidence: 0,
      confidenceLevel: 'low',
      outputs: [],
      recommendations: ['Add discussion topics to generate a meeting agenda'],
      decisionTrail: ['No topics provided'],
      timestamp: new Date().toISOString(),
    };
  }

  // Meeting structure based on type
  const meetingStructures: Record<string, { intro: number; wrap: number; buffer: number }> = {
    general: { intro: 5, wrap: 5, buffer: 5 },
    standup: { intro: 2, wrap: 3, buffer: 0 },
    brainstorm: { intro: 5, wrap: 10, buffer: 5 },
    review: { intro: 5, wrap: 10, buffer: 5 },
    planning: { intro: 10, wrap: 10, buffer: 10 },
    'one-on-one': { intro: 3, wrap: 5, buffer: 5 },
    kickoff: { intro: 10, wrap: 10, buffer: 10 },
  };

  const structure = meetingStructures[meetingType] || meetingStructures.general;
  const overheadTime = structure.intro + structure.wrap + structure.buffer;
  const availableTime = duration - overheadTime;

  // Adjust topic times if needed
  if (totalAllocated > availableTime) {
    const ratio = availableTime / totalAllocated;
    topics.forEach(topic => {
      topic.minutes = Math.max(2, Math.floor(topic.minutes * ratio));
    });
    totalAllocated = topics.reduce((sum, t) => sum + t.minutes, 0);
    decisionTrail.push(`Adjusted topic times to fit ${availableTime} available minutes`);
  }

  // Build agenda document
  const agendaSections: string[] = [];

  agendaSections.push(`# ${meetingTitle}`);
  agendaSections.push(``);
  agendaSections.push(`**Date:** ${meetingDate}`);
  agendaSections.push(`**Duration:** ${duration} minutes`);
  agendaSections.push(`**Attendees:** ${attendeeCount} participants`);
  agendaSections.push(`**Organizer:** ${organizer}`);
  agendaSections.push(``);
  agendaSections.push(`---`);
  agendaSections.push(``);
  agendaSections.push(`## Agenda`);
  agendaSections.push(``);

  let currentTime = 0;

  // Opening
  agendaSections.push(`**${formatTime(currentTime)} - ${formatTime(currentTime + structure.intro)}** | Opening & Check-in (${structure.intro} min)`);
  agendaSections.push(`- Welcome attendees`);
  agendaSections.push(`- Quick round-robin check-in (if applicable)`);
  agendaSections.push(`- Review meeting objectives`);
  agendaSections.push(``);
  currentTime += structure.intro;

  // Main topics
  topics.forEach((topic, index) => {
    agendaSections.push(`**${formatTime(currentTime)} - ${formatTime(currentTime + topic.minutes)}** | ${topic.name} (${topic.minutes} min)`);
    agendaSections.push(`- Owner: ${topic.owner}`);
    agendaSections.push(`- [ ] Key discussion point`);
    agendaSections.push(`- [ ] Decision/action needed`);
    agendaSections.push(``);
    currentTime += topic.minutes;
  });

  // Wrap-up
  agendaSections.push(`**${formatTime(currentTime)} - ${formatTime(currentTime + structure.wrap)}** | Wrap-up & Next Steps (${structure.wrap} min)`);
  agendaSections.push(`- Review action items`);
  agendaSections.push(`- Assign owners and due dates`);
  agendaSections.push(`- Schedule follow-up if needed`);
  agendaSections.push(``);

  if (structure.buffer > 0) {
    agendaSections.push(`*Buffer time: ${structure.buffer} minutes for overflow*`);
    agendaSections.push(``);
  }

  agendaSections.push(`---`);
  agendaSections.push(``);
  agendaSections.push(`## Pre-Meeting Prep`);
  agendaSections.push(`- [ ] Review this agenda`);
  agendaSections.push(`- [ ] Prepare updates for your topics`);
  agendaSections.push(`- [ ] Bring questions/blockers to discuss`);

  const agendaDocument = agendaSections.join('\n');
  decisionTrail.push('Generated formatted meeting agenda');

  // Calculate effectiveness score
  let effectivenessScore = 40;
  if (topics.length >= 2 && topics.length <= 5) effectivenessScore += 20; // Optimal topic count
  if (totalAllocated <= availableTime) effectivenessScore += 15; // Not over-scheduled
  if (topics.some(t => t.owner !== 'TBD')) effectivenessScore += 15; // Has owners
  if (duration >= 30 && duration <= 60) effectivenessScore += 10; // Optimal duration

  // Generate recommendations
  const recommendations: string[] = [];

  if (topics.length > 5) {
    recommendations.push('Consider reducing topics to 3-5 for more focused discussion');
  }
  if (topics.every(t => t.owner === 'TBD')) {
    recommendations.push('Assign topic owners before the meeting');
  }
  if (totalAllocated > availableTime * 0.9) {
    recommendations.push('Schedule is tight - be prepared to table items if needed');
  }
  if (duration > 60) {
    recommendations.push('For meetings over 60 min, consider adding a 5-min break');
  }
  if (meetingType === 'brainstorm') {
    recommendations.push('Send pre-read materials 24 hours before to spark ideas');
  }
  if (attendeeCount > 8) {
    recommendations.push('Large group - consider breakout sessions for detailed discussions');
  }
  recommendations.push('Share agenda 24 hours before the meeting');
  recommendations.push('Start and end on time to respect attendees\' schedules');

  // Confidence calculation
  const confidence = calculateInputConfidence(inputs, [
    'meetingDate', 'organizer', 'topic2', 'topic3', 'topic1Owner', 'topic2Owner',
  ]);

  return {
    summary: `Created ${duration}-minute ${meetingType} agenda with ${topics.length} topics for ${attendeeCount} attendees. Effectiveness score: ${effectivenessScore}%.`,
    confidence,
    confidenceLevel: getConfidenceLevel(confidence),
    outputs: [
      {
        id: 'meetingTitle',
        label: 'Meeting Title',
        value: meetingTitle,
        format: 'text',
        highlight: true,
      },
      {
        id: 'meetingType',
        label: 'Meeting Type',
        value: meetingType.charAt(0).toUpperCase() + meetingType.slice(1),
        format: 'text',
      },
      {
        id: 'totalDuration',
        label: 'Duration',
        value: duration,
        format: 'number',
        description: 'minutes',
      },
      {
        id: 'topicCount',
        label: 'Agenda Topics',
        value: topics.length,
        format: 'number',
        trend: topics.length >= 2 && topics.length <= 5 ? 'positive' : 'neutral',
      },
      {
        id: 'effectiveness',
        label: 'Effectiveness Score',
        value: effectivenessScore,
        format: 'percentage',
        trend: effectivenessScore >= 70 ? 'positive' : effectivenessScore >= 50 ? 'neutral' : 'negative',
        highlight: true,
      },
      {
        id: 'agendaDocument',
        label: 'Agenda Document',
        value: agendaDocument,
        format: 'text',
        description: 'Full formatted agenda',
      },
    ],
    recommendations,
    decisionTrail,
    chart: {
      labels: ['Opening', ...topics.map(t => t.name.substring(0, 12)), 'Wrap-up'],
      datasets: [
        {
          label: 'Minutes Allocated',
          data: [structure.intro, ...topics.map(t => t.minutes), structure.wrap],
          type: 'bar',
          color: '#10b981',
        },
      ],
    },
    timestamp: new Date().toISOString(),
  };
}

function formatTime(minutes: number): string {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}`;
  }
  return `0:${mins.toString().padStart(2, '0')}`;
}
