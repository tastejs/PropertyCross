
using System.Windows.Input;
using System;

namespace PropertyFinder.ViewModel
{
  public class DelegateCommand : ICommand
  {
    private Action _action;

    public DelegateCommand(Action action)
    {
      _action = action;
    }

    public bool CanExecute(object parameter)
    {
      return true;
    }

    public event EventHandler CanExecuteChanged;

    public void Execute(object parameter)
    {
      _action();
    }
  }

  public class DelegateCommand<T> : ICommand
  {
    private Action<T> _action;

    public DelegateCommand(Action<T> action)
    {
      _action = action;
    }

    public bool CanExecute(object parameter)
    {
      return true;
    }

    public event EventHandler CanExecuteChanged;

    public void Execute(object parameter)
    {
      _action((T)parameter);
    }
  }
}
