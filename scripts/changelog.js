#!/usr/bin/env node

/**
 * Changelog generfor Academic Platform
 * Generates changelog based on conventional commits
 */

const { execSync } = require('child_process');
const fs = require('fs');

function getCommitsSinceLastTag() {
  try {
    const lastTag = execSync('git describe --tags --abbrev=0', { encoding: 'utf8' }).trim();
    const commits = execSync(`git log ${lastTag}..HEAD --oneline --pretty=format:"%h|%s|%an|%ad" --date=short`, { encoding: 'utf8' });
    return commits.split('\n').filter(line => line.trim());
  } catch (error) {
    // No tags found, get all commits
    const commits = execSync('git log --oneline --pretty=format:"%h|%s|%an|%ad" --date=short', { encoding: 'utf8' });
    return commits.split('\n').filter(line => line.trim());
  }
}

function parseCommit(commitLine) {
  const [hash, message, author, date] = commitLine.split('|');

  // Parse conventional commit format
  const conventionalRegex = /^(feat|fix|docs|style|refactor|test|chore|perf|ci|build)(\(.+\))?: (.+)$/;
  const match = message.match(conventionalRegex);

  if (match) {
    return {
      hash: hash.substring(0, 7),
      type: match[1],
      scope: match[2] ? match[2].slice(1, -1) : null,
      description: match[3],
      author,
      date,
      breaking: message.includes('BREAKING CHANGE')
    };
  }

  return {
    hash: hash.substring(0, 7),
    type: 'other',
    scope: null,
    description: message,
    author,
    date,
    breaking: false
  };
}

function groupCommitsByType(commits) {
  const groups = {
    breaking: [],
    feat: [],
    fix: [],
    perf: [],
    docs: [],
    style: [],
    refactor: [],
    test: [],
    chore: [],
    ci: [],
],
    other: []
  };

  commits.forEach(commit => {
    if (commit.breaking) {
      groups.breaking.push(commit);
    } else {
      groups[commit.type].push(commit);
    }
  });

  return groups;
}

function generateChangelogSection(title, commits, emoji = '') {
  if (commits.length === 0) return '';

  let section = `\n### ${emoji} ${title}\n\n`;

  commits.forEach(commit => {
    const scope = commit.scope ? `**${commit.scope}**: ` : '';
    section += `- ${scope}${commit.description} ([${commit.hash}](../../commit/${commit.hash}))\n`;
  });

  return section;
}

function generateChangelog() {
  console.log('📝 Generating changelog from git commits...');

  coson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const version = packageJson.version;
  const date = new Date().toISOString().split('T')[0];

  const commitLines = getCommitsSinceLastTag();
  const commits = commitLines.map(parseCommit);
  const groupedCommits = groupCommitsByType(commits);

  let changelog = `## [${version}] - ${date}\n`;

  // Breaking changes first
  changelog += generateChangelogSection('💥 BREAKING CHANGES', groupedCommits.breaking, '💥');

  // Features
  changelog += generateChangelogSection('Features', groupedCommits.feat, '✨');

  // Bug fixes
  changelog += generateChangelogSection('Bug Fixes', groupedCommits.fix, '🐛');

  // Performance improvements
  changelog += generateChangelogSection('Performance Improvements', groupedCommits.perf, '⚡');

  // Documentation
  changelog += generateChangelogSection('Documentation', groupedCommits.docs, '📚');

  // Refactoring
  changelog += generateChangelogSection('Code Refactoring', groupedCommits.refactor, '♻️');

  // Tests
  changelog += generateChangelogSection('Tests', groupedCommits.test, '✅');

  // Build system
  changelog += generateChangelogSection('Build System', groupedCommits.build, '🔧');

  // CI
  changelog += generateChangelogSection('Continuous Integration', groupedCommits.ci, '👷');

  // Chores
  changelog += generateChangelogSection('Chores', groupedCommits.chore, '🔨');

  // Other
  changelog += generateChangelogSection('Other Changes', groupedCommits.other, '📦');

  // Update CHANGELOG.md
  const changelogPath = 'CHANGELOG.md';
  let existingChangelog = '';

  if (fs.existsSync(changelogPath)) {
    existingChangelog = fs.readFileSync(changelogPath, 'utf8');
    // Remove the header if it exists
    existingChangelog = existingChangelog.replace(/^# Changelog\n\n/, '');
  }

  coChangelog = `# Changelog\n\nAll notable changes to this project will be documented in this file.\n\nThe format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),\nand this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).\n\n${changelog}\n${existingChangelog}`;

  fs.writeFileSync(changelogPath, fullChangelog);

  console.log(`✅ Changelog updated for version ${version}`);
  console.log(`📄 ${commits.length} commits processed`);
}

if (require.main === module) {
  generateChangelog();
}

module.exports = { generateChangelog };
