const RssFeedEmitter = require('rss-feed-emitter')
const Github = require('./lib/github')
const Repo = require('./lib/repository')
const Slack = require('./lib/slack')
const Utility = require('./lib/utility')

let feeder = new RssFeedEmitter()
let github = new Github()
let slack = new Slack({ token: process.env.SLACK_TOKEN })

let remote = {
  origin: {
    url: process.env.ORIGIN_REPO_URL,
    owner: Utility.extractRepoOwner(process.env.ORIGIN_REPO_URL),
    name: Utility.extractRepoName(process.env.ORIGIN_REPO_URL),
    defaultBranch: process.env.ORIGIN_REPO_DEFAULT_BRANCH,
  },
  upstream: {
    url: process.env.UPSTREAM_REPO_URL,
    owner: Utility.extractRepoOwner(process.env.UPSTREAM_REPO_URL),
    name: Utility.extractRepoName(process.env.UPSTREAM_REPO_URL),
    defaultBranch: process.env.UPSTREAM_REPO_DEFAULT_BRANCH,
  },
  head: {
    url: process.env.HEAD_REPO_URL,
    name: Utility.extractRepoName(process.env.HEAD_REPO_URL),
    defaultBranch: process.env.HEAD_REPO_DEFAULT_BRANCH,
  },
}

let repo = new Repo(
  {
    path: 'repo',
    remote,
    user: {
      name: process.env.USER_NAME,
      email: process.env.EMAIL,
    },
  }
)

function setup() {
  repo.setup()
  github.authenticate({ type: 'token', token: process.env.GITHUB_ACCESS_TOKEN })
  setupFeeder()
}

function setupFeeder() {
  feeder.add({
    url: process.env.FEED_URL,
    refresh: Number(process.env.FEED_REFRESH),
  })

  feeder.on('new-item', function(item) {
    Utility.log('I', `New commit: ${item.title}`)
    let hash = Utility.extractBasename(item.link)
    // branch names consisting of 40 hex characters are not allowed
    let shortHash = hash.substr(0, 8)

    if (repo.existsRemoteBranch(shortHash)) {
      Utility.log('W', `Remote branch already exists: ${shortHash}`)
      return
    }

    repo.fetchAllRemotes()
    repo.updateLocal()
    repo.createNewBranch(shortHash)

    if (repo.hasConflicts('cherry-pick', hash)) {
      Utility.log('W', 'Conflicts occurred. Please make a pull request by yourself')
      repo.resetChanges()
    } else {
      Utility.log('S', `Fully merged: ${shortHash}`)
      repo.updateRemote()
      after(item, hash, shortHash)
    }
  })
}

async function after(item, hash, shortHash) {
  const { data: pullRequest } = await github.createPullRequest(remote, { title: item.title, body: `Cherry picked from ${item.link}`, branch: shortHash })
  Utility.log('S', `Created new pull request: ${pullRequest.html_url}`)

  const { messages } = await slack.searchMessages({ query: hash })
  if (!messages) return
  let message = messages.matches.find(extractMatchedMessage)
  if (!message) return
  const { ok: result } = await slack.addReactions({ name: 'raising_hand', channel: process.env.SLACK_CHANNEL, timestamp: message.ts })
  if (result) Utility.log('S', `Add reaction: ${message.permalink}`)
}

function extractMatchedMessage(message) {
  return message.text !== '' && message.channel.id === process.env.SLACK_CHANNEL && message.username === 'recent commits to vuejs.org:master'
}

setup()
