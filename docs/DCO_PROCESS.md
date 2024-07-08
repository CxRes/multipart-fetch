# Developer Certificate of Origin

This project embraces the Developer Certificate of Origin (DCO) for contributions. DCO is a very simple sign-off process during a commit to ensure that copyright ownership remains with the contributors while project stakeholders are protected from copyright claims. (For a fun historical background, search for "Smoking Crack Organization")

## The Fine Print

**DCO is not an assignment of rights to the project. You retain the copyright to your contributions!**

The DCO is a legally binding statement asserting that you are either the creator of your contribution or that you are otherwise free to distribute the contribution without any restrictions (such as academic or employment ties), and that you are intentionally making the contribution available under the license associated with the project. All contributions are made under the same licenses as the rest of the project (inbound = outbound). Please see the [LICENSE](../LICENSE) file at the root level of this repository to learn about the license under which this project is published. Additional licenses applicable to this project might be found in the respective LICENSE-\* files at the project root.

The Developer Certificate of Origin can be found in [`DCO`](../DCO) file. If the DCO was not included, you may obtain a copy at <http://developercertificate.org/>. Please read it carefully! Consult your lawyer if you are unsure of what it means.

You acknowledge to have met the requirements specified in the DCO by attaching an attestation to every contribution in the format specified below (an exception is made for an ["Obvious Fix"](#the-obvious-fix-exception)). The project maintainers will not accept contributions unless the attestation is attached in the required format.

If you subsequently become aware of any facts or circumstances that would make these commitments inaccurate in any way, you must immediately convey this information to the project maintainers. You may do so by opening a new issue where the project is hosted. You can find this information in the `package.json` manifest.

## Method

The sign-off is a simple line at the end of the commit message:

```roff
Signed-off-by: Contributor Name <{identification}> [for {Copyright Holder}] [Digital Signature]
```

#### `Contributor Name`

Please use your real name to sign off the contribution. Neither anonymous contributions nor those utilizing pseudonyms will be accepted.

#### `{identification}`

One of the following must be included:

- Functioning e-mail address or
- Pseudo email address provided by a git hosting service such as GitHub or GitLab.

#### `[for {Copyright Holder}]`

**(optional)** In case you are making a submission on behalf of another entity, it is your responsibility to ensure that you have necessary permissions to make the submissions. By adding this token, you confirm that the said entity also attests to the terms of the DCO. Additionally, you are required to use an identification (such as an organizational e-mail address) that establishes your association with the said entity. In the absence of this clause, it is assumed that the copyright for the submission belongs to you.

#### `[Digital Signature]`

**(optional)** If you so wish, you may also digitally sign the commit.

_You may add additional tags to indicate some special detail about the sign-off. Additional lines (usually enclosed in square brackets) may also be added before the sign-off to give credit or to indicate changes to a previous sign-off. Some [guidance](https://github.com/torvalds/linux/blob/master/Documentation/process/submitting-patches.rst#11-sign-your-work---the-developers-certificate-of-origin) for the same can be found at the Linux kernel project._

## Set-up

Git provides a convenient switch in the `commit` command to automate the sign-off process (assuming that you are signing-off with your git credentials):

```sh
> git commit -s
> git commit --signoff
```

Alternatively, you may set up a commit template with the sign-off in a text file. Instruct git to use the template by adding the following to the relevant `.gitconfig` file:

```ini
[config]
    template = path/to/template
```

or by running the command

```sh
> git config --global config.template path/to/template
```

## The “Obvious Fix” Exception

> _adapted from [Chef Documentation > Community Contributions](https://docs.chef.io/community_contributions.html#the-obvious-fix-rule) > &copy; [Chef Documentation](https://docs.chef.io/), licensed under [CC-BY 3.0](https://github.com/chef/chef-web-docs/blob/master/LICENSE)_

To encourage broader participation and to lower the barrier for new contributors, we allow an exception to the DCO sign-off process for obvious fixes.

As a rule of thumb, changes are obvious fixes if they do not introduce any new functionality or creative thinking. As long as the change does not affect functionality, some likely examples include the following:

- Spelling/grammar fixes,
- Correcting typos,
- Cleaning up comments in the code,
- Changes to white space or formatting,
- Bug fixes that change default return values or error codes stored in constants, literals, or simple variable types,
- Adding logging messages or debugging output,
- Changes to ‘metadata’ files, example configuration files, build scripts, etc.,
- Changes that reflect outside facts, like renaming a build directory or changing a constant,
- Changes in build or installation scripts,
- Re-ordering of objects or subroutines within a source file,
- Moving source files from one directory or package to another, with no changes in code
- Breaking a source file into multiple source files, or consolidating multiple source files into one source file, with no change in code behaviour,
- Changes to words or phrases isolated from their context,
- Changes to typeface.

Things that would still require a DCO sign-off before submitting would likely include the following:

- Any of the above actions that result in a change in functionality,
- A new feature,
- A translation,
- Extensive or creative comments.

If you make a submission without the sign-off, then you are agreeing that your submission is not independently copyrightable.
