const findProblemsByCompany = (company, problems) => {
  const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };

  const matched = problems.filter((p) =>
    p.companies.some((c) => c.toLowerCase() === company.toLowerCase()),
  );

  if (matched.length < 10) {
    const popular = problems.filter(
      (p) =>
        p.companies.length >= 3 &&
        !matched.find((m) => m._id.toString() === p._id.toString()),
    );
    matched.push(...popular.slice(0, 15 - matched.length));
  }

  matched.sort(
    (a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty],
  );

  return matched.slice(0, 15);
};

module.exports = { findProblemsByCompany };
