define ["lib/knockout", "cs!viewModel/ApplicationViewModel", "cs!style/styleLoader"], (ko, AppVM) ->
    ko.applyBindings new AppVM()