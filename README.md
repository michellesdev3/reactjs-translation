# Translating reactjs.org

## First Steps

To start a new translation project, submit a PR to add your language to [languages.json](./languages.json) with the following information:

* Language name
* [Language code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)
* List of maintainers

For example:

```json
{
  "name": "English",
  "code": "en",
  "maintainers": ["gaearon", "tesseralis"]
}
```

The bot will:

* Create a new repository for you at `reactjs/{lang-code}.reactjs.org`
* Add/invite all maintainers listed to a "reactjs.org {language} Translation" team in the reactjs organization
* Create an issue from [this template](./PROGRESS.template.md) in the new repository to track your translation progress

After that, you may want to [pin](https://help.github.com/articles/pinning-an-issue-to-your-repository/) the generated issue to make it easier to find.

Happy translating!

## Translating Tips

### Be Prompt

As with maintaining any repository, be prompt with reviewing pull requests / responding to volunteers.

### Make a glossary

Create a glossary of the translations of technical and React-specific terms. Put this in a highly visible location (the README or a pinned issue). For examples of glossaries, see:

* Simplified Chinese: https://github.com/reactjs/zh-hans.reactjs.org/issues/2
* Japanese: https://github.com/reactjs/ja.reactjs.org/wiki/%E8%A8%B3%E8%AA%9E%E3%81%AE%E7%B5%B1%E4%B8%80
* Spanish: https://github.com/reactjs/es.reactjs.org/blob/master/TRANSLATION.md#common-translations

### Use the bot!

Remember to review the issues generated by [reactjs-translation-bot](https://github.com/reactjs-translation-bot). The bot will create issues and PRs for recent changes to the master repository. It's important to review these to make sure our translations stay up to date with the current documentation.

### Ask for help

If you have a question that isn't addressed here, go to the global [ReactJS localization team](https://github.com/orgs/reactjs/teams/reactjs-org-localization) and ask your fellow translators for help!

## Before publishing

1. Review your translations and make sure that the pages listed in "minimum viable translation" are fully translated. Run the site yourself locally to make sure there are no bugs or snags.
2. ask {TBD} to add {lang-code}.reactjs.org as a subdomain
3. submit a PR to [reactjs/reactjs.org](https://github.com/reactjs/reactjs.org) adding the language in the dropdown
4. celebrate!

## Acknowledgements

This repo, and the bot that makes all this possible, is based off of and iterated upon [che-tsumi](https://github.com/vuejs-jp/che-tsumi/tree/master/lib) by the [Vue.js Japan User Group](https://github.com/vuejs-jp).
