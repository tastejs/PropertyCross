using System;
using System.Net;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Ink;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;
using Microsoft.Phone.Controls;
using LinqToVisualTree;
using System.Diagnostics;
using System.Collections.Generic;
using System.Windows.Controls.Primitives;
using System.Windows.Media.Imaging;

namespace MetroInMotionUtils
{
  public static class MetroInMotion
  {
    #region AnimationLevel

    public static int GetAnimationLevel(DependencyObject obj)
    {
      return (int)obj.GetValue(AnimationLevelProperty);
    }

    public static void SetAnimationLevel(DependencyObject obj, int value)
    {
      obj.SetValue(AnimationLevelProperty, value);
    }


    public static readonly DependencyProperty AnimationLevelProperty =
        DependencyProperty.RegisterAttached("AnimationLevel", typeof(int),
        typeof(MetroInMotion), new PropertyMetadata(-1));

    #endregion

    #region Tilt

    public static double GetTilt(DependencyObject obj)
    {
      return (double)obj.GetValue(TiltProperty);
    }

    public static void SetTilt(DependencyObject obj, double value)
    {
      obj.SetValue(TiltProperty, value);
    }


    public static readonly DependencyProperty TiltProperty =
        DependencyProperty.RegisterAttached("Tilt", typeof(double),
        typeof(MetroInMotion), new PropertyMetadata(2.0, OnTiltChanged));

    /// <summary>
    /// The extent of the tilt action, the larger the number, the bigger the tilt
    /// </summary>
    private static double TiltAngleFactor = 4;

    /// <summary>
    /// The extent of the scaling action, the smaller the number, the greater the scaling.
    /// </summary>
    private static double ScaleFactor = 100;

    private static void OnTiltChanged(DependencyObject d,
      DependencyPropertyChangedEventArgs args)
    {
      FrameworkElement targetElement = d as FrameworkElement;
      
      double tiltFactor = GetTilt(d);

      // create the required transformations
      var projection = new PlaneProjection();
      var scale = new ScaleTransform();
      var translate = new TranslateTransform();

      var transGroup = new TransformGroup();
      transGroup.Children.Add(scale);
      transGroup.Children.Add(translate);

      // associate with the target element
      targetElement.Projection = projection;
      targetElement.RenderTransform = transGroup;
      targetElement.RenderTransformOrigin = new Point(0.5, 0.5);

      targetElement.MouseLeftButtonDown += (s, e) =>
        {
          var clickPosition = e.GetPosition(targetElement);

          // find the maximum of width / height
          double maxDimension = Math.Max(targetElement.ActualWidth, targetElement.ActualHeight);

          // compute the normalised horizontal distance from the centre
          double distanceFromCenterX = targetElement.ActualWidth / 2 - clickPosition.X;
          double normalisedDistanceX = 2 * distanceFromCenterX / maxDimension; 

          // rotate around the Y axis 
          projection.RotationY = normalisedDistanceX * TiltAngleFactor * tiltFactor;

          // compute the normalised vertical distance from the centre
          double distanceFromCenterY = targetElement.ActualHeight / 2 - clickPosition.Y;
          double normalisedDistanceY = 2 * distanceFromCenterY / maxDimension;

          // rotate around the X axis, 
          projection.RotationX = -normalisedDistanceY * TiltAngleFactor * tiltFactor;

          // find the distance to centre
          double distanceToCentre = Math.Sqrt(normalisedDistanceX * normalisedDistanceX
            + normalisedDistanceY * normalisedDistanceY);

          // scale accordingly
          double scaleVal = tiltFactor * (1 - distanceToCentre) / ScaleFactor;
          scale.ScaleX = 1 - scaleVal;
          scale.ScaleY = 1 - scaleVal;

          // offset the plane transform
          var rootElement = Application.Current.RootVisual as FrameworkElement;
          var relativeToCentre = (targetElement.GetRelativePosition(rootElement).Y - rootElement.ActualHeight / 2) / 2;
          translate.Y = -relativeToCentre;
          projection.LocalOffsetY = +relativeToCentre;

        };

      targetElement.ManipulationCompleted += (s, e) =>
        {
          var sb = new Storyboard();
          sb.Children.Add(CreateAnimation(null, 0, 0.1, "RotationY", projection));
          sb.Children.Add(CreateAnimation(null, 0, 0.1, "RotationX", projection));
          sb.Children.Add(CreateAnimation(null, 1, 0.1, "ScaleX", scale));
          sb.Children.Add(CreateAnimation(null, 1, 0.1, "ScaleY", scale));
          sb.Begin();

          translate.Y = 0;
          projection.LocalOffsetY = 0;
        };

    }


    #endregion

     /// <summary>
    /// Animates each element in order, creating a 'peel' effect. The supplied action
    /// is invoked when the animation ends.
    /// </summary>
    public static void Peel(this IEnumerable<FrameworkElement> elements, Action endAction)
    {
      var elementList = elements.ToList();
      var lastElement = elementList.Last();

      // iterate over all the elements, animating each of them
      double delay = 0;
      foreach (FrameworkElement element in elementList)
      {
        var sb = GetPeelAnimation(element, delay);

        // add a Completed event handler to the last element
        if (element.Equals(lastElement))
        {
          sb.Completed += (s, e) =>
            {
              endAction();
            };
        }

        sb.Begin();
        delay += 50;
      }
    }


    /// <summary>
    /// Enumerates all the items that are currently visible in am ItemsControl. This implementation assumes
    /// that a VirtualizingStackPanel is being used as the ItemsPanel.
    /// </summary>
    public static IEnumerable<FrameworkElement> GetItemsInView(this ItemsControl itemsControl)
    {
       // locate the stack panel that hosts the items
      VirtualizingStackPanel vsp = itemsControl.Descendants<VirtualizingStackPanel>().First() as VirtualizingStackPanel;

      // iterate over each of the items in view
      int firstVisibleItem = (int)vsp.VerticalOffset;
      int visibleItemCount = (int)vsp.ViewportHeight;
      for (int index = firstVisibleItem; index <= firstVisibleItem + visibleItemCount + 1; index++)
      {
        var item = itemsControl.ItemContainerGenerator.ContainerFromIndex(index) as FrameworkElement;
        if (item == null)
          continue;

        yield return item;
      }
    }

    /// <summary>
    /// Creates a PlaneProjection and associates it with the given element, returning
    /// a Storyboard which will animate the PlaneProjection to 'peel' the item
    /// from the screen.
    /// </summary>
    private static Storyboard GetPeelAnimation(FrameworkElement element, double delay)
    {
      Storyboard sb;

      var projection = new PlaneProjection()
      {
        CenterOfRotationX = -0.1
      };
      element.Projection = projection;

      // compute the angle of rotation required to make this element appear
      // at a 90 degree angle at the edge of the screen.
      var width = element.ActualWidth;
      var targetAngle = Math.Atan(1000 / (width / 2));
      targetAngle = targetAngle * 180 / Math.PI;

      // animate the projection
      sb = new Storyboard();
      sb.BeginTime = TimeSpan.FromMilliseconds(delay);      
      sb.Children.Add(CreateAnimation(0, -(180 - targetAngle), 0.3, "RotationY", projection));
      sb.Children.Add(CreateAnimation(0, 23, 0.3, "RotationZ", projection));
      sb.Children.Add(CreateAnimation(0, -23, 0.3, "GlobalOffsetZ", projection));      
      return sb;
    }

    private static DoubleAnimation CreateAnimation(double? from, double? to, double duration,
      string targetProperty, DependencyObject target)
    {
      var db = new DoubleAnimation();
      db.To = to;
      db.From = from;
      db.EasingFunction = new SineEase();
      db.Duration = TimeSpan.FromSeconds(duration);
      Storyboard.SetTarget(db, target);
      Storyboard.SetTargetProperty(db, new PropertyPath(targetProperty));
      return db;
    }

    /// <summary>
    /// Creates a TranslateTransform and associates it with the given element, returning
    /// a Storyboard which will animate the TranslateTransform with a SineEase function
    /// </summary>
    private static Storyboard  GetSlideAnimation(FrameworkElement element, bool fromRight)
    {
      double from = fromRight ? 80 : -80;
      
      Storyboard sb;
      double delay = (MetroInMotion.GetAnimationLevel(element)) * 0.1 + 0.1;

      TranslateTransform trans = new TranslateTransform() { X = from };
      element.RenderTransform = trans;

      sb = new Storyboard();
      sb.BeginTime = TimeSpan.FromSeconds(delay);
      sb.Children.Add(CreateAnimation(from, 0, 0.8, "X", trans));      
      return sb;
    }

  }

  public static class ExtensionMethods
  {
    public static Point GetRelativePosition(this UIElement element, UIElement other)
    {
      return element.TransformToVisual(other)
        .Transform(new Point(0, 0));
    }
  }

  /// <summary>
  /// Animates an element so that it flies out and flies in!
  /// </summary>
  public class ItemFlyInAndOutAnimations
  {
    private Popup _popup;

    private Canvas _popupCanvas;

    private FrameworkElement _targetElement;

    private Point _targetElementPosition;

    private Image _targetElementClone;

    private Rectangle _backgroundMask;

    private static TimeSpan _flyInSpeed = TimeSpan.FromMilliseconds(200);

    private static TimeSpan _flyOutSpeed = TimeSpan.FromMilliseconds(300);

    public ItemFlyInAndOutAnimations()
    {
      // construct a popup, with a Canvas as its child
      _popup = new Popup();
      _popupCanvas = new Canvas();
      _popup.Child = _popupCanvas;
    }

    public static void TitleFlyIn(FrameworkElement title)
    {
      TranslateTransform trans = new TranslateTransform();
      trans.X = 300;
      trans.Y = -50;
      title.RenderTransform = trans;      

      var sb = new Storyboard();

      // animate the X position
      var db = CreateDoubleAnimation(300, 0,
          new SineEase(), trans, TranslateTransform.XProperty, _flyInSpeed);
      sb.Children.Add(db);

      // animate the Y position
      db = CreateDoubleAnimation(-100, 0,
          new SineEase(), trans, TranslateTransform.YProperty, _flyInSpeed);
      sb.Children.Add(db);

      sb.Begin();
    }

    /// <summary>
    /// Animate the previously 'flown-out' element back to its original location.
    /// </summary>
    public void ItemFlyIn()
    {
      if (_popupCanvas.Children.Count != 2)
        return;

      _popup.IsOpen = true;
      _backgroundMask.Opacity = 0.0;

      Image animatedImage = _popupCanvas.Children[1] as Image;

      var sb = new Storyboard();

      // animate the X position
      var db = CreateDoubleAnimation(_targetElementPosition.X - 100, _targetElementPosition.X,
          new SineEase(),
          _targetElementClone, Canvas.LeftProperty, _flyInSpeed);
      sb.Children.Add(db);

      // animate the Y position
      db = CreateDoubleAnimation(_targetElementPosition.Y - 50, _targetElementPosition.Y,
          new SineEase(),
          _targetElementClone, Canvas.TopProperty, _flyInSpeed);
      sb.Children.Add(db);

      sb.Completed += (s, e) =>
        {
          // when the animation has finished, hide the popup once more
          _popup.IsOpen = false;

          // restore the element we have animated
          _targetElement.Opacity = 1.0;

          // and get rid of our clone
          _popupCanvas.Children.Clear();
        };

      sb.Begin();
    }


    /// <summary>
    /// Animate the given element so that it flies off screen, fading 
    /// everything else that is on screen.
    /// </summary>
    public void ItemFlyOut(FrameworkElement element, Action action)
    {
      _targetElement = element;
      var rootElement = Application.Current.RootVisual as FrameworkElement;

      _backgroundMask = new Rectangle()
      {
        Fill = new SolidColorBrush(Colors.Black),
        Opacity = 0.0,
        Width = rootElement.ActualWidth,
        Height = rootElement.ActualHeight
      };
      _popupCanvas.Children.Add(_backgroundMask);

      _targetElementClone = new Image()
      {
        Source = new WriteableBitmap(element, null)
      };
      _popupCanvas.Children.Add(_targetElementClone);

      _targetElementPosition = element.GetRelativePosition(rootElement);
      Canvas.SetTop(_targetElementClone, _targetElementPosition.Y);
      Canvas.SetLeft(_targetElementClone, _targetElementPosition.X);

      var sb = new Storyboard();

      // animate the X position
      var db = CreateDoubleAnimation(_targetElementPosition.X, _targetElementPosition.X + 500,
          new SineEase() { EasingMode = EasingMode.EaseIn },
          _targetElementClone, Canvas.LeftProperty, _flyOutSpeed);
      sb.Children.Add(db);

      // animate the Y position
      db = CreateDoubleAnimation(_targetElementPosition.Y, _targetElementPosition.Y + 50,
          new SineEase() { EasingMode = EasingMode.EaseOut },
          _targetElementClone, Canvas.TopProperty, _flyOutSpeed);
      sb.Children.Add(db);     
      
      // fade out the other elements
      db = CreateDoubleAnimation(0, 1,
          null, _backgroundMask, UIElement.OpacityProperty, _flyOutSpeed);
      sb.Children.Add(db);

      sb.Completed += (s, e2) =>
        {
          action();

          // hide the popup, by placing a task on the dispatcher queue, this
          // should be executed after the navigation has occurred
          element.Dispatcher.BeginInvoke(() =>
          {
            _popup.IsOpen = false;
          });
        };

      // hide the element we have 'cloned' into the popup
      element.Opacity = 0.0;

      // open the popup
      _popup.IsOpen = true;

      // begin the animation
      sb.Begin();
    }

    public static DoubleAnimation CreateDoubleAnimation(double from, double to, IEasingFunction easing,
      DependencyObject target, object propertyPath, TimeSpan duration)
    {
      var db = new DoubleAnimation();
      db.To = to;
      db.From = from;
      db.EasingFunction = easing;
      db.Duration = duration;
      Storyboard.SetTarget(db, target);
      Storyboard.SetTargetProperty(db, new PropertyPath(propertyPath));
      return db;
    }
  }
}
