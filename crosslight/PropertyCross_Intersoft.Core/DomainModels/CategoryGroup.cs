using System.Linq;
using Intersoft.AppFramework;
using Intersoft.Crosslight;

namespace PropertyCross_Intersoft.DomainModels.Inventory
{
    public class CategoryGroup : GroupItem<Item>
    {
        #region Constructors

        public CategoryGroup(IGrouping<string, Item> groupItem)
            : base(groupItem)
        {
            ICategoryRepository categoryRepository = this.CategoryRepository;
            if (categoryRepository != null)
                this.Category = categoryRepository.GetByName(groupItem.Key);
        }

        #endregion

        #region Properties

        public Category Category { get; private set; }

        private ICategoryRepository CategoryRepository
        {
            get { return Container.Current.Resolve<ICategoryRepository>(); }
        }

        #endregion
    }
}