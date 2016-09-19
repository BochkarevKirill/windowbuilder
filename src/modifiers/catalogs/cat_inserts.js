/**
 * Дополнительные методы справочника Вставки
 *
 * Created 23.12.2015<br />
 * &copy; http://www.oknosoft.ru 2014-2015
 * @author Evgeniy Malyarov
 * @module cat_inserts
 */

$p.cat.inserts.__define({

	_inserts_types_filling: {
		value: [
			$p.enm.inserts_types.Стеклопакет,
			$p.enm.inserts_types.Заполнение,
			$p.enm.inserts_types.ТиповойСтеклопакет
		]
	},

	by_thickness: {
		value: function (min, max) {

			if(!this._by_thickness){
				this._by_thickness = {};
				this.find_rows({insert_type: {in: this._inserts_types_filling}}, function (ins) {
					if(ins.thickness > 0){
						if(!this._by_thickness[ins.thickness])
							this._by_thickness[ins.thickness] = [];
						this._by_thickness[ins.thickness].push(ins);
					}
				}.bind(this));
			}

			var res = [];
			for(var thickness in this._by_thickness){
				if(parseFloat(thickness) >= min && parseFloat(thickness) <= max)
					Array.prototype.push.apply(res, this._by_thickness[thickness]);
			}
			return res;

		}
	}

});

$p.CatInserts.prototype.__define({

	/**
	 * Возвращает номенклатуру вставки в завсисмости от свойств элемента
	 */
	nom: {
		value: function (elm) {

			var main_rows = [], _nom;

			this.specification.find_rows({is_main_elm: true}, function (row) {
				main_rows.push(row);
			});

			if(!this._cache)
				this._cache = {};

			if(this._cache.nom)
				return this._cache.nom;

			if(!main_rows.length && this.specification.count())
				main_rows.push(this.specification.get(0));

			if(main_rows.length && main_rows[0].nom instanceof $p.CatInserts)
				_nom = main_rows[0].nom.nom();

			else if(main_rows.length)
				_nom = main_rows[0].nom;

			else
				_nom = $p.cat.nom.get();

			if(main_rows.length < 2)
				this._cache.nom = _nom;

			return _nom;

		}
	},

	/**
	 * Возвращает толщину вставки
	 */
	thickness: {
		get: function () {

			if(!this._cache)
				this._cache = {};

			var _cache = this._cache;

			if(!_cache.hasOwnProperty("thickness")){
				_cache.thickness = 0;
				if(this.insert_type == $p.enm.inserts_types.ТиповойСтеклопакет || this.insert_type == $p.enm.inserts_types.Стеклопакет){

					if(this.insert_glass_type == $p.enm.inserts_glass_types.Рамка)
						_cache.thickness += this.nom().thickness;

					else if(this.insert_glass_type == $p.enm.inserts_glass_types.Стекло)
						this.specification.each(function (row) {
							_cache.thickness += row.nom.thickness;
						});
				}else
					_cache.thickness = this.nom().thickness;
			}

			return _cache.thickness;

		}
	}

});
